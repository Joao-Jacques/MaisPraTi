// Exceção personalizada
class DescontoInvalidoException extends RuntimeException {
    public DescontoInvalidoException(String mensagem) {
        super(mensagem);
    }
}

public class atividade_2 {
    private String nome;
    private double preco;
    private int quantidadeEmEstoque;

    // Construtor
    public atividade_2(String nome, double preco, int quantidadeEmEstoque) {
        setNome(nome);
        setPreco(preco);
        setQuantidadeEmEstoque(quantidadeEmEstoque);
    }

    // Getters
    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }

    public int getQuantidadeEmEstoque() {
        return quantidadeEmEstoque;
    }

    // Setters com validação
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome não pode ser nulo ou vazio.");
        }
        this.nome = nome;
    }

    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("O preço não pode ser negativo.");
        }
        this.preco = preco;
    }

    public void setQuantidadeEmEstoque(int quantidadeEmEstoque) {
        if (quantidadeEmEstoque < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser negativa.");
        }
        this.quantidadeEmEstoque = quantidadeEmEstoque;
    }

    // Novo método: aplicar desconto
    public void aplicarDesconto(double porcentagem) {
        if (porcentagem < 0 || porcentagem > 50) {
            throw new DescontoInvalidoException("O desconto deve estar entre 0% e 50%.");
        }
        double desconto = preco * (porcentagem / 100);
        preco -= desconto;
    }

    @Override
    public String toString() {
        return "Produto{" +
                "nome='" + nome + '\'' +
                ", preco=" + preco +
                ", quantidadeEmEstoque=" + quantidadeEmEstoque +
                '}';
    }

    // Demonstração
    public static void main(String[] args) {
        atividade_2 p1 = new atividade_2("Smartphone", 2000.00, 15);

        System.out.println("Produto original: " + p1);

        // Aplicando desconto válido
        try {
            System.out.println("\nAplicando 20% de desconto...");
            p1.aplicarDesconto(20);
            System.out.println("Após desconto: " + p1);
        } catch (DescontoInvalidoException e) {
            System.out.println("Erro: " + e.getMessage());
        }

        // Tentando desconto inválido (> 50%)
        try {
            System.out.println("\nTentando aplicar 70% de desconto...");
            p1.aplicarDesconto(70);
        } catch (DescontoInvalidoException e) {
            System.out.println("Erro: " + e.getMessage());
        }

        // Tentando desconto inválido (< 0%)
        try {
            System.out.println("\nTentando aplicar -10% de desconto...");
            p1.aplicarDesconto(-10);
        } catch (DescontoInvalidoException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
}
