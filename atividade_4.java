import java.util.ArrayList;
import java.util.List;

// Interface
interface IMeioTransporte {
    void acelerar(int incremento);
    void frear(int decremento);
    int getVelocidade();
}

// Classe Carro
class Carro implements IMeioTransporte {
    private int velocidade = 0;
    private final int VELOCIDADE_MAX = 200;

    @Override
    public void acelerar(int incremento) {
        if (incremento <= 0) {
            throw new IllegalArgumentException("O incremento deve ser positivo.");
        }
        if (velocidade + incremento > VELOCIDADE_MAX) {
            throw new IllegalStateException("Velocidade máxima do carro atingida!");
        }
        velocidade += incremento;
    }

    @Override
    public void frear(int decremento) {
        if (decremento <= 0) {
            throw new IllegalArgumentException("O decremento deve ser positivo.");
        }
        if (velocidade - decremento < 0) {
            throw new IllegalStateException("O carro já está parado!");
        }
        velocidade -= decremento;
    }

    @Override
    public int getVelocidade() {
        return velocidade;
    }

    @Override
    public String toString() {
        return "Carro";
    }
}

// Classe Bicicleta
class Bicicleta implements IMeioTransporte {
    private int velocidade = 0;
    private final int VELOCIDADE_MAX = 50;

    @Override
    public void acelerar(int incremento) {
        if (incremento <= 0) {
            throw new IllegalArgumentException("O incremento deve ser positivo.");
        }
        if (velocidade + incremento > VELOCIDADE_MAX) {
            throw new IllegalStateException("Velocidade máxima da bicicleta atingida!");
        }
        velocidade += incremento;
    }

    @Override
    public void frear(int decremento) {
        if (decremento <= 0) {
            throw new IllegalArgumentException("O decremento deve ser positivo.");
        }
        if (velocidade - decremento < 0) {
            throw new IllegalStateException("A bicicleta já está parada!");
        }
        velocidade -= decremento;
    }

    @Override
    public int getVelocidade() {
        return velocidade;
    }

    @Override
    public String toString() {
        return "Bicicleta";
    }
}

// Classe Trem
class Trem implements IMeioTransporte {
    private int velocidade = 0;
    private final int VELOCIDADE_MAX = 300;

    @Override
    public void acelerar(int incremento) {
        if (incremento <= 0) {
            throw new IllegalArgumentException("O incremento deve ser positivo.");
        }
        if (velocidade + incremento > VELOCIDADE_MAX) {
            throw new IllegalStateException("Velocidade máxima do trem atingida!");
        }
        velocidade += incremento;
    }

    @Override
    public void frear(int decremento) {
        if (decremento <= 0) {
            throw new IllegalArgumentException("O decremento deve ser positivo.");
        }
        if (velocidade - decremento < 0) {
            throw new IllegalStateException("O trem já está parado!");
        }
        velocidade -= decremento;
    }

    @Override
    public int getVelocidade() {
        return velocidade;
    }

    @Override
    public String toString() {
        return "Trem";
    }
}

// Classe principal para demonstração
public class atividade_4 {
    public static void main(String[] args) {
        List<IMeioTransporte> transportes = new ArrayList<>();
        transportes.add(new Carro());
        transportes.add(new Bicicleta());
        transportes.add(new Trem());

        for (IMeioTransporte t : transportes) {
            System.out.println("\n--- " + t + " ---");

            try {
                t.acelerar(30);
                System.out.println(t + " acelerou. Velocidade atual: " + t.getVelocidade());

                t.frear(10);
                System.out.println(t + " freou. Velocidade atual: " + t.getVelocidade());

                // Testando erro (frear demais)
                t.frear(1000);
            } catch (Exception e) {
                System.out.println("Erro em " + t + ": " + e.getMessage());
            }
        }
    }
}
