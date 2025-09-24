public class atividade_1 {
    private String nome;
    private double preco;
    private int quantidadeEmEstoque;

    // Construtor
    public atividade_1(String nome, double preco, int quantidadeEmEstoque) {
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

    @Override
    public String toString() {
        return "Produto{" +
                "nome='" + nome + '\'' +
                ", preco=" + preco +
                ", quantidadeEmEstoque=" + quantidadeEmEstoque +
                '}';
    }

    // Classe de demonstração
    public static void main(String[] args) {
        try {
            atividade_1 p1 = new atividade_1("Notebook", 3500.00, 10);
            System.out.println(p1);

            // Alterando valores válidos
            p1.setPreco(3200.00);
            p1.setQuantidadeEmEstoque(8);
            System.out.println("Após alterações válidas: " + p1);

            // Tentando valores inválidos
            System.out.println("\nTentando atribuir valores inválidos:");
            p1.setPreco(-1000.00); // Vai lançar exceção
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }

        try {
            atividade_1 p2 = new atividade_1("", 100.0, 5); // Vai lançar exceção
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }

        try {
            atividade_1 p3 = new atividade_1("Cadeira Gamer", 1500.0, -2); // Vai lançar exceção
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
}
