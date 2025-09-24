import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

// ===== Exceções =====
class CepInvalidoException extends RuntimeException {
    public CepInvalidoException(String msg) { super(msg); }
}
class PedidoInvalidoException extends RuntimeException {
    public PedidoInvalidoException(String msg) { super(msg); }
}

// ===== Região (mapeamento didático pelo 1º dígito do CEP) =====
enum Regiao {
    SUDESTE, SUL, CENTRO_OESTE, NORDESTE, NORTE;

    static Regiao fromCep(String cep) {
        validarCep(cep);
        int d = cep.charAt(0) - '0';
        if (d <= 3) return SUDESTE;      // 0–3
        if (d <= 6) return SUL;          // 4–6
        if (d == 7) return CENTRO_OESTE; // 7
        if (d == 8) return NORDESTE;     // 8
        return NORTE;                    // 9
    }

    static void validarCep(String cep) {
        if (cep == null || !cep.matches("\\d{8}")) {
            throw new CepInvalidoException("CEP inválido: use 8 dígitos (ex.: 01310930).");
        }
    }
}

// ===== Strategy =====
@FunctionalInterface
interface CalculadoraFrete {
    BigDecimal calcular(Pedido pedido); // devolve o valor do frete

    default BigDecimal arred(BigDecimal v) {
        return v.setScale(2, RoundingMode.HALF_EVEN);
    }
}

// ===== Pedido (injeta/troca estratégia) =====
class Pedido {
    private final BigDecimal pesoKg;      // > 0
    private final BigDecimal valorItens;  // >= 0
    private final String cepDestino;      // 8 dígitos
    private final String cepLoja;         // 8 dígitos
    private CalculadoraFrete estrategia;

    public Pedido(BigDecimal pesoKg, BigDecimal valorItens, String cepDestino, String cepLoja,
                  CalculadoraFrete estrategia) {
        if (pesoKg == null || pesoKg.compareTo(BigDecimal.ZERO) <= 0)
            throw new PedidoInvalidoException("Peso deve ser > 0.");
        if (valorItens == null || valorItens.compareTo(BigDecimal.ZERO) < 0)
            throw new PedidoInvalidoException("Valor dos itens não pode ser negativo.");
        Regiao.validarCep(cepDestino);
        Regiao.validarCep(cepLoja);
        this.pesoKg = pesoKg;
        this.valorItens = valorItens;
        this.cepDestino = cepDestino;
        this.cepLoja = cepLoja;
        this.estrategia = Objects.requireNonNull(estrategia, "Estratégia obrigatória.");
    }

    public BigDecimal calcularFrete() { return estrategia.calcular(this); }
    public void setEstrategia(CalculadoraFrete nova) { this.estrategia = Objects.requireNonNull(nova); }

    // Getters
    public BigDecimal getPesoKg()     { return pesoKg; }
    public BigDecimal getValorItens() { return valorItens; }
    public String getCepDestino()     { return cepDestino; }
    public String getCepLoja()        { return cepLoja; }
    public Regiao getRegiaoDestino()  { return Regiao.fromCep(cepDestino); }
}

// ===== Estratégias concretas =====
class Sedex implements CalculadoraFrete {
    @Override
    public BigDecimal calcular(Pedido p) {
        BigDecimal base = new BigDecimal("15.90");
        BigDecimal porKg = new BigDecimal("8.50").multiply(p.getPesoKg());
        BigDecimal mult = switch (p.getRegiaoDestino()) {
            case SUDESTE      -> new BigDecimal("1.00");
            case SUL          -> new BigDecimal("1.10");
            case CENTRO_OESTE -> new BigDecimal("1.20");
            case NORDESTE     -> new BigDecimal("1.25");
            case NORTE        -> new BigDecimal("1.35");
        };
        return arred(base.add(porKg).multiply(mult));
    }
}

class Pac implements CalculadoraFrete {
    @Override
    public BigDecimal calcular(Pedido p) {
        BigDecimal base = new BigDecimal("9.90");
        BigDecimal porKg = new BigDecimal("5.00").multiply(p.getPesoKg());
        BigDecimal mult = switch (p.getRegiaoDestino()) {
            case SUDESTE      -> new BigDecimal("1.00");
            case SUL          -> new BigDecimal("1.05");
            case CENTRO_OESTE -> new BigDecimal("1.12");
            case NORDESTE     -> new BigDecimal("1.15");
            case NORTE        -> new BigDecimal("1.25");
        };
        return arred(base.add(porKg).multiply(mult));
    }
}

class RetiradaNaLoja implements CalculadoraFrete {
    @Override
    public BigDecimal calcular(Pedido p) {
        // mesma área: 5 primeiros dígitos iguais
        if (!p.getCepDestino().substring(0,5).equals(p.getCepLoja().substring(0,5))) {
            throw new CepInvalidoException("Retirada na loja disponível apenas para a mesma área (5 primeiros dígitos do CEP).");
        }
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN);
    }
}

// ===== Demonstração =====
public class atividade_8 {
    public static void main(String[] args) {
        // Pedido: 2.3 kg, R$ 320, destino 01310930 (SP), loja 01310900 (SP)
        Pedido pedido = new Pedido(
                new BigDecimal("2.3"),
                new BigDecimal("320.00"),
                "01310930",
                "01310900",
                new Pac() // estratégia inicial
        );

        System.out.println("PAC      → frete: R$ " + pedido.calcularFrete());

        // Troca dinâmica para SEDEX
        pedido.setEstrategia(new Sedex());
        System.out.println("SEDEX    → frete: R$ " + pedido.calcularFrete());

        // Troca para retirada na loja
        pedido.setEstrategia(new RetiradaNaLoja());
        System.out.println("RETIRADA → frete: R$ " + pedido.calcularFrete());

        // Estratégia PROMO via lambda: frete grátis acima de X (ex.: R$ 299)
        BigDecimal limiteGratis = new BigDecimal("299.00");
        CalculadoraFrete promoGratisAcimaDeX = p -> {
            if (p.getValorItens().compareTo(limiteGratis) >= 0) {
                return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN);
            }
            // fallback: cobra PAC quando não atingir o limite
            return new Pac().calcular(p);
        };

        pedido.setEstrategia(promoGratisAcimaDeX);
        System.out.println("PROMO (≥ " + limiteGratis + ") → frete: R$ " + pedido.calcularFrete());

        // Exemplo de CEP inválido (dispara exceção)
        try {
            new Pedido(new BigDecimal("1.0"), new BigDecimal("50"), "ABC12345", "01310900", new Pac());
        } catch (CepInvalidoException e) {
            System.out.println("Erro esperado: " + e.getMessage());
        }

        // Exemplo de retirada fora da área
        try {
            Pedido pedidoLonge = new Pedido(new BigDecimal("1.0"), new BigDecimal("50"),
                    "22250040", "01310900", new RetiradaNaLoja());
            System.out.println(pedidoLonge.calcularFrete()); // não deve chegar aqui
        } catch (CepInvalidoException e) {
            System.out.println("Retirada negada: " + e.getMessage());
        }
    }
}
