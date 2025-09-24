import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

// =============== Moeda ===============
enum Moeda { BRL, USD, EUR }

// =============== Objeto de Valor: Dinheiro (imutável) ===============
final class Dinheiro {
    private final BigDecimal valor; // sempre escala 2 e HALF_EVEN
    private final Moeda moeda;

    private static final RoundingMode ROUNDING = RoundingMode.HALF_EVEN;

    public Dinheiro(BigDecimal valor, Moeda moeda) {
        if (moeda == null) throw new IllegalArgumentException("Moeda não pode ser nula.");
        if (valor == null) throw new IllegalArgumentException("Valor não pode ser nulo.");
        if (valor.compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException("Valor não pode ser negativo.");
        this.moeda = moeda;
        this.valor = valor.setScale(2, ROUNDING);
    }

    public static Dinheiro of(String valor, Moeda moeda) {
        return new Dinheiro(new BigDecimal(valor), moeda);
    }

    public BigDecimal valor() { return valor; }
    public Moeda moeda() { return moeda; }

    private void assertMesmaMoeda(Dinheiro outro) {
        if (outro == null || this.moeda != outro.moeda)
            throw new IllegalArgumentException("Moedas devem ser iguais.");
    }

    public Dinheiro mais(Dinheiro outro) {
        assertMesmaMoeda(outro);
        return new Dinheiro(this.valor.add(outro.valor), this.moeda);
    }

    public Dinheiro vezes(int fator) {
        if (fator < 0) throw new IllegalArgumentException("Fator não pode ser negativo.");
        return new Dinheiro(this.valor.multiply(BigDecimal.valueOf(fator)), this.moeda);
    }

    public Dinheiro vezes(BigDecimal fator) {
        if (fator == null || fator.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Fator inválido.");
        return new Dinheiro(this.valor.multiply(fator).setScale(2, ROUNDING), this.moeda);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Dinheiro)) return false;
        Dinheiro d = (Dinheiro) o;
        // compara moeda e valor numérico (ignorando diferenças de escala)
        return this.moeda == d.moeda && this.valor.compareTo(d.valor) == 0;
    }

    @Override
    public int hashCode() {
        // normaliza para stripTrailingZeros para hash consistente
        return Objects.hash(moeda, valor.stripTrailingZeros());
    }

    @Override
    public String toString() {
        return moeda + " " + valor.toPlainString();
    }
}

// =============== Produto (imutável) ===============
final class Produto {
    private final String id;
    private final String nome;
    private final Dinheiro preco;

    public Produto(String id, String nome, Dinheiro preco) {
    if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("Id inválido.");
    if (nome == null || nome.trim().isEmpty()) throw new IllegalArgumentException("Nome inválido.");
        if (preco == null) throw new IllegalArgumentException("Preço não pode ser nulo.");
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    public String getId() { return id; }
    public String getNome() { return nome; }
    public Dinheiro getPreco() { return preco; }
}

// =============== ItemCarrinho (imutável) ===============
final class ItemCarrinho {
    private final Produto produto;
    private final int quantidade; // > 0

    public ItemCarrinho(Produto produto, int quantidade) {
        if (produto == null) throw new IllegalArgumentException("Produto não pode ser nulo.");
        if (quantidade <= 0) throw new IllegalArgumentException("Quantidade deve ser > 0.");
        this.produto = produto;
        this.quantidade = quantidade;
    }

    public Produto getProduto() { return produto; }
    public int getQuantidade() { return quantidade; }

    public Dinheiro subtotal() {
        return produto.getPreco().vezes(quantidade);
    }

    // helper para somar quantidades do mesmo produto, mantendo imutabilidade
    public ItemCarrinho somarQuantidade(int delta) {
        if (delta <= 0) throw new IllegalArgumentException("Delta deve ser > 0.");
        return new ItemCarrinho(produto, quantidade + delta);
    }
}

// =============== Carrinho (imutável) ===============
final class Carrinho {
    private final Moeda moeda;
    private final List<ItemCarrinho> itens;           // lista imutável
    private final BigDecimal descontoPercentual;      // 0.00 a 0.30 (fração, ex: 0.25 = 25%)
    private static final BigDecimal DESCONTO_MAX = new BigDecimal("0.30");
    private static final RoundingMode ROUNDING = RoundingMode.HALF_EVEN;

    private Carrinho(Moeda moeda, List<ItemCarrinho> itens, BigDecimal descontoPercentual) {
        if (moeda == null) throw new IllegalArgumentException("Moeda não pode ser nula.");
        if (itens == null) throw new IllegalArgumentException("Lista de itens não pode ser nula.");
        if (descontoPercentual == null
                || descontoPercentual.compareTo(BigDecimal.ZERO) < 0
                || descontoPercentual.compareTo(DESCONTO_MAX) > 0) {
            throw new IllegalArgumentException("Desconto deve estar entre 0% e 30%.");
        }
        // garante que todos os produtos têm a mesma moeda do carrinho
        for (ItemCarrinho it : itens) {
            if (it.getProduto().getPreco().moeda() != moeda) {
                throw new IllegalArgumentException("Todos os itens devem usar a mesma moeda do carrinho.");
            }
        }
        // cópia defensiva + unmodifiable
        this.moeda = moeda;
        this.itens = Collections.unmodifiableList(new ArrayList<>(itens));
        this.descontoPercentual = descontoPercentual.setScale(2, ROUNDING); // escala de exibição; cálculo usa BigDecimal normal
    }

    public static Carrinho vazio(Moeda moeda) {
        return new Carrinho(moeda, java.util.Arrays.asList(), BigDecimal.ZERO);
    }

    public Moeda getMoeda() { return moeda; }
    public List<ItemCarrinho> getItens() { return itens; }
    public BigDecimal getDescontoPercentual() { return descontoPercentual; }

    public Carrinho adicionar(Produto produto, int quantidade) {
        if (produto == null) throw new IllegalArgumentException("Produto não pode ser nulo.");
        if (produto.getPreco().moeda() != this.moeda)
            throw new IllegalArgumentException("Moeda do produto difere da moeda do carrinho.");
        if (quantidade <= 0) throw new IllegalArgumentException("Quantidade deve ser > 0.");

        List<ItemCarrinho> nova = new ArrayList<>(this.itens);
        // se já existe o produto, soma quantidade
        OptionalInt idx = OptionalInt.empty();
        for (int i = 0; i < nova.size(); i++) {
            if (nova.get(i).getProduto().getId().equals(produto.getId())) {
                idx = OptionalInt.of(i);
                break;
            }
        }
        if (idx.isPresent()) {
            ItemCarrinho atual = nova.get(idx.getAsInt());
            nova.set(idx.getAsInt(), atual.somarQuantidade(quantidade));
        } else {
            nova.add(new ItemCarrinho(produto, quantidade));
        }
        return new Carrinho(this.moeda, nova, this.descontoPercentual);
    }

    public Carrinho removerPorId(String produtoId) {
    if (produtoId == null || produtoId.trim().isEmpty()) throw new IllegalArgumentException("produtoId inválido.");
        List<ItemCarrinho> nova = this.itens.stream()
                .filter(it -> !it.getProduto().getId().equals(produtoId))
                .collect(Collectors.toCollection(ArrayList::new));
        return new Carrinho(this.moeda, nova, this.descontoPercentual);
    }

    /** cupomPercent de 0 a 30 inclusive */
    public Carrinho aplicarCupomPercent(int cupomPercent) {
        if (cupomPercent < 0 || cupomPercent > 30)
            throw new IllegalArgumentException("Cupom inválido: permitido apenas 0% a 30%.");
        BigDecimal p = BigDecimal.valueOf(cupomPercent).movePointLeft(2); // 25 -> 0.25
        return new Carrinho(this.moeda, this.itens, p);
    }

    public Dinheiro totalBruto() {
        Dinheiro total = new Dinheiro(BigDecimal.ZERO, moeda);
        for (ItemCarrinho it : itens) {
            total = total.mais(it.subtotal());
        }
        return total;
    }

    public Dinheiro totalLiquido() {
        Dinheiro bruto = totalBruto();
        BigDecimal fator = BigDecimal.ONE.subtract(descontoPercentual);
        return new Dinheiro(bruto.valor().multiply(fator).setScale(2, ROUNDING), moeda);
    }

    @Override
    public String toString() {
        String itensStr = itens.stream()
                .map(i -> i.getProduto().getNome() + " x" + i.getQuantidade() + " = " + i.subtotal())
                .collect(Collectors.joining(", "));
        return "Carrinho{" +
                "moeda=" + moeda +
                ", itens=[" + itensStr + "]" +
                ", desconto=" + descontoPercentual.movePointRight(2) + "%" +
                ", totalBruto=" + totalBruto() +
                ", totalLiquido=" + totalLiquido() +
                '}';
    }
}
