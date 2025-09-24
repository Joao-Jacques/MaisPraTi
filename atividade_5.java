import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

// ===================== Exceção específica =====================
class PagamentoInvalidoException extends RuntimeException {
    public PagamentoInvalidoException(String msg) { super(msg); }
}

// ===================== Abstração =====================
abstract class FormaPagamento {
    private final String descricao;

    protected FormaPagamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() { return descricao; }

    /** Deve lançar PagamentoInvalidoException quando inválido. */
    public abstract void validarPagamento();

    /** Template method: valida + executa a cobrança. */
    public final String processarPagamento(BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PagamentoInvalidoException("Valor do pagamento deve ser positivo.");
        }
        validarPagamento();
        executarCobranca(valor);
        return "Pagamento de R$ " + valor + " aprovado via " + getDescricao();
    }

    /** Implementação específica de cada meio. */
    protected abstract void executarCobranca(BigDecimal valor);
}

// ===================== Cartão de Crédito =====================
class CartaoCredito extends FormaPagamento {
    private final String numero;      // somente dígitos
    private final String nomeTitular;
    private final String cvv;         // 3-4 dígitos
    private final YearMonth validade; // mês/ano

    public CartaoCredito(String numero, String nomeTitular, String cvv, YearMonth validade) {
        super("Cartão de Crédito");
        this.numero = numero != null ? numero.replaceAll("\\s+", "") : null;
        this.nomeTitular = nomeTitular;
        this.cvv = cvv;
        this.validade = validade;
    }

    @Override
    public void validarPagamento() {
        if (numero == null || !numero.matches("\\d{13,19}"))
            throw new PagamentoInvalidoException("Número de cartão inválido (13–19 dígitos).");
        if (!luhnValido(numero))
            throw new PagamentoInvalidoException("Número de cartão reprovado no Luhn.");
        if (nomeTitular == null || nomeTitular.trim().isEmpty())
            throw new PagamentoInvalidoException("Nome do titular é obrigatório.");
        if (cvv == null || !cvv.matches("\\d{3,4}"))
            throw new PagamentoInvalidoException("CVV inválido (3–4 dígitos).");
        if (validade == null || validade.isBefore(YearMonth.now()))
            throw new PagamentoInvalidoException("Cartão vencido.");
    }

    private boolean luhnValido(String num) {
        int soma = 0; boolean par = false;
        for (int i = num.length() - 1; i >= 0; i--) {
            int d = num.charAt(i) - '0';
            if (par) { d *= 2; if (d > 9) d -= 9; }
            soma += d; par = !par;
        }
        return soma % 10 == 0;
    }

    @Override
    protected void executarCobranca(BigDecimal valor) {
        // simulação de autorização/captura
        System.out.println("[Cartão] Autorizando e capturando R$ " + valor + " para " + nomeTitular + "...");
    }
}

// ===================== Boleto =====================
class Boleto extends FormaPagamento {
    private final String linhaDigitavel; // 47 ou 48 dígitos

    public Boleto(String linhaDigitavel) {
        super("Boleto");
        this.linhaDigitavel = linhaDigitavel != null ? linhaDigitavel.replaceAll("\\s+", "") : null;
    }

    @Override
    public void validarPagamento() {
        if (linhaDigitavel == null || !linhaDigitavel.matches("\\d{47}|\\d{48}"))
            throw new PagamentoInvalidoException("Linha digitável inválida (47 ou 48 dígitos).");
        // (Opcional) validar DV de campos — omitido para simplicidade
    }

    @Override
    protected void executarCobranca(BigDecimal valor) {
        System.out.println("[Boleto] Gerando boleto (linha digitável: " + mascarar(linhaDigitavel) + ") no valor de R$ " + valor + ".");
    }

    private String mascarar(String s) {
        if (s.length() <= 8) return s;
        return s.substring(0,5) + "..." + s.substring(s.length()-5);
    }
}

// ===================== Pix =====================
class Pix extends FormaPagamento {
    private final String chave; // e-mail, CPF, CNPJ, telefone +55..., ou UUID

    private static final Pattern EMAIL   = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern CPF     = Pattern.compile("^\\d{11}$");
    private static final Pattern CNPJ    = Pattern.compile("^\\d{14}$");
    private static final Pattern FONEBR  = Pattern.compile("^\\+?55\\d{10,11}$"); // +55DDDNXXXXXXXX
    private static final Pattern UUIDv4  = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");

    public Pix(String chave) {
        super("Pix");
        this.chave = chave;
    }

    @Override
    public void validarPagamento() {
        if (chave == null || chave.trim().isEmpty())
            throw new PagamentoInvalidoException("Chave Pix é obrigatória.");
        String c = chave.trim();
        boolean ok = EMAIL.matcher(c).matches()
                  || CPF.matcher(c).matches()
                  || CNPJ.matcher(c).matches()
                  || FONEBR.matcher(c).matches()
                  || UUIDv4.matcher(c).matches();
        if (!ok) throw new PagamentoInvalidoException("Chave Pix inválida (email/CPF/CNPJ/telefone/UUID).");
    }

    @Override
    protected void executarCobranca(BigDecimal valor) {
        System.out.println("[Pix] Enviando Pix de R$ " + valor + " para chave \"" + chave + "\"...");
    }
}

// ===================== Demonstração (polimorfismo) =====================
public class atividade_5 {
    public static void main(String[] args) {
        List<FormaPagamento> formas = new ArrayList<>();
        formas.add(new CartaoCredito("4539 1488 0343 6467", "Maria Souza", "123", YearMonth.now().plusMonths(6))); // VISA válida no Luhn (exemplo)
        formas.add(new Boleto("23793381286000000003306000012345678901234567"));
        formas.add(new Pix("maria.souza@example.com"));
        formas.add(new Pix("+5598999123456"));
        formas.add(new CartaoCredito("4111111111111111", "João Silva", "12", YearMonth.now().plusYears(1))); // CVV inválido
        formas.add(new Boleto("123")); // boleto inválido

        BigDecimal valor = new BigDecimal("149.90");

        for (FormaPagamento f : formas) {
            try {
                String recibo = f.processarPagamento(valor);
                System.out.println("OK → " + recibo);
            } catch (PagamentoInvalidoException e) {
                System.out.println("ERRO (" + f.getDescricao() + "): " + e.getMessage());
            }
        }
    }
}
