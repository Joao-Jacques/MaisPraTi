import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

// ========= Contrato de Identidade =========
interface Identificavel<ID> {
    ID getId();
}

// ========= Exceção específica =========
class EntidadeNaoEncontradaException extends RuntimeException {
    public EntidadeNaoEncontradaException(String msg) { super(msg); }
}

// ========= Interface do Repositório Genérico =========
interface IRepository<ID, T extends Identificavel<ID>> {
    void salvar(T entidade);                        // cria/atualiza
    Optional<T> buscarPorId(ID id);                 // Optional
    List<T> listarTodos();                          // cópia imutável
    void remover(ID id) throws EntidadeNaoEncontradaException;
}

// ========= Implementação em Memória =========
class InMemoryRepository<ID, T extends Identificavel<ID>> implements IRepository<ID, T> {
    private final Map<ID, T> store = new HashMap<>();

    @Override
    public void salvar(T entidade) {
        if (entidade == null) throw new IllegalArgumentException("Entidade não pode ser nula.");
        if (entidade.getId() == null) throw new IllegalArgumentException("ID da entidade não pode ser nulo.");
        store.put(entidade.getId(), entidade); // upsert
    }

    @Override
    public Optional<T> buscarPorId(ID id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public List<T> listarTodos() {
        // cópia + imutável
        return Collections.unmodifiableList(new ArrayList<>(store.values()));
    }

    @Override
    public void remover(ID id) {
        if (store.remove(id) == null) {
            throw new EntidadeNaoEncontradaException("ID não encontrado: " + id);
        }
    }
}

// ========= Entidades de exemplo =========
class Produto implements Identificavel<String> {
    private final String id;
    private final String nome;
    private final BigDecimal preco;

    public Produto(String id, String nome, BigDecimal preco) {
        if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("Id inválido.");
        if (nome == null || nome.trim().isEmpty()) throw new IllegalArgumentException("Nome inválido.");
        if (preco == null || preco.compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException("Preço inválido.");
        this.id = id;
        this.nome = nome;
        this.preco = preco.setScale(2, RoundingMode.HALF_EVEN);
    }

    @Override public String getId() { return id; }
    public String getNome() { return nome; }
    public BigDecimal getPreco() { return preco; }

    @Override public String toString() {
        return "Produto{id='" + id + "', nome='" + nome + "', preco=" + preco + "}";
    }
}

class Funcionario implements Identificavel<String> {
    private final String id;
    private final String nome;
    private final BigDecimal salario;

    public Funcionario(String id, String nome, BigDecimal salario) {
        if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("Id inválido.");
        if (nome == null || nome.trim().isEmpty()) throw new IllegalArgumentException("Nome inválido.");
        if (salario == null || salario.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Salário deve ser positivo.");
        this.id = id;
        this.nome = nome;
        this.salario = salario.setScale(2, RoundingMode.HALF_EVEN);
    }

    @Override public String getId() { return id; }
    public String getNome() { return nome; }
    public BigDecimal getSalario() { return salario; }

    @Override public String toString() {
        return "Funcionario{id='" + id + "', nome='" + nome + "', salario=" + salario + "}";
    }
}

// ========= Demonstração =========
public class atividade_7 {
    public static void main(String[] args) {
        IRepository<String, Produto> repoProdutos = new InMemoryRepository<>();
        IRepository<String, Funcionario> repoFuncionarios = new InMemoryRepository<>();

        // Salvar
        repoProdutos.salvar(new Produto("P1", "Notebook", new BigDecimal("3500")));
        repoProdutos.salvar(new Produto("P2", "Mouse", new BigDecimal("79.9")));
        repoFuncionarios.salvar(new Funcionario("F1", "Carlos", new BigDecimal("10000")));
        repoFuncionarios.salvar(new Funcionario("F2", "Ana", new BigDecimal("6500")));

        // Listar (cópia imutável)
        System.out.println("Produtos: " + repoProdutos.listarTodos());
        System.out.println("Funcionários: " + repoFuncionarios.listarTodos());

        // Buscar por ID
        repoProdutos.buscarPorId("P2").ifPresent(p -> System.out.println("Encontrado: " + p));
        System.out.println("Buscar inexistente P9: " + repoProdutos.buscarPorId("P9")); // Optional.empty

        // Remover existente
        repoProdutos.remover("P1");
        System.out.println("Após remover P1 → " + repoProdutos.listarTodos());

        // Remover inexistente (lança exceção)
        try {
            repoProdutos.remover("P9");
        } catch (EntidadeNaoEncontradaException e) {
            System.out.println("Erro esperado ao remover: " + e.getMessage());
        }

        // Tentativa de modificar lista (deve falhar)
        List<Produto> lista = repoProdutos.listarTodos();
        try {
            lista.add(new Produto("P3", "Teclado", new BigDecimal("199.90")));
        } catch (UnsupportedOperationException e) {
            System.out.println("Lista é imutável: não é possível adicionar diretamente.");
        }

        // Upsert: salvar com mesmo ID atualiza
        repoFuncionarios.salvar(new Funcionario("F2", "Ana Paula", new BigDecimal("7000")));
        System.out.println("Funcionários (após upsert F2): " + repoFuncionarios.listarTodos());
    }
}
