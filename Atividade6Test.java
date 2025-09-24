import java.math.BigDecimal;

public class Atividade6Test {
    public static void main(String[] args) {
        // Criação de produtos
        Produto p1 = new Produto("1", "Camiseta", Dinheiro.of("100.00", Moeda.BRL));
        Produto p2 = new Produto("2", "Calça", Dinheiro.of("200.00", Moeda.BRL));

        // Carrinho vazio
        Carrinho carrinho = Carrinho.vazio(Moeda.BRL);
        System.out.println("Carrinho vazio: " + carrinho);

        // Adiciona produtos
        carrinho = carrinho.adicionar(p1, 2);
        carrinho = carrinho.adicionar(p2, 1);
        System.out.println("Carrinho após adicionar produtos: " + carrinho);

        // Remove produto
        carrinho = carrinho.removerPorId("1");
        System.out.println("Carrinho após remover Camiseta: " + carrinho);

        // Aplica cupom de 25%
        carrinho = carrinho.aplicarCupomPercent(25);
        System.out.println("Carrinho com cupom 25%: " + carrinho);

        // Testa limites de cupom
        try {
            carrinho.aplicarCupomPercent(35);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro esperado ao aplicar cupom > 30%: " + e.getMessage());
        }

        // Testa quantidade inválida
        try {
            carrinho.adicionar(p1, 0);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro esperado ao adicionar quantidade 0: " + e.getMessage());
        }

        // Testa valor negativo
        try {
            new Dinheiro(new BigDecimal("-10.00"), Moeda.BRL);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro esperado ao criar Dinheiro negativo: " + e.getMessage());
        }
    }
}
