import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// Classe base
abstract class Funcionario {
    protected String nome;
    protected BigDecimal salario;

    public Funcionario(String nome, BigDecimal salario) {
        if (salario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O salário deve ser positivo.");
        }
        this.nome = nome;
        this.salario = salario;
    }

    public String getNome() {
        return nome;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    // Método abstrato para sobrescrever
    public abstract BigDecimal calcularBonus();
}

// Subclasse Gerente
class Gerente extends Funcionario {
    public Gerente(String nome, BigDecimal salario) {
        super(nome, salario);
    }

    @Override
    public BigDecimal calcularBonus() {
        return salario.multiply(new BigDecimal("0.20")); // 20%
    }
}

// Subclasse Desenvolvedor
class Desenvolvedor extends Funcionario {
    public Desenvolvedor(String nome, BigDecimal salario) {
        super(nome, salario);
    }

    @Override
    public BigDecimal calcularBonus() {
        return salario.multiply(new BigDecimal("0.10")); // 10%
    }
}

// Classe principal de demonstração
public class atividade_3 {
    public static void main(String[] args) {
        List<Funcionario> funcionarios = new ArrayList<>();

        funcionarios.add(new Gerente("Carlos", new BigDecimal("10000")));
        funcionarios.add(new Desenvolvedor("Ana", new BigDecimal("6000")));
        funcionarios.add(new Desenvolvedor("Pedro", new BigDecimal("7000")));

        for (Funcionario f : funcionarios) {
            System.out.println(
                f.getClass().getSimpleName() + " - " + f.getNome() +
                " | Salário: R$ " + f.getSalario() +
                " | Bônus: R$ " + f.calcularBonus()
            );
        }
    }
}
