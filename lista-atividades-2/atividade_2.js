// 2. Jogo de Adivinhação
// Escreva um script que gere um número aleatório de 1 a 100 e peça ao
// usuário, para adivinhar.Use while para repetir até acertar, contando
// tentativas e exibindo “mais alto” ou “mais baixo” a cada palpite errado.
prompt = require('prompt-sync')();

function jogoAdivinhacao() {
    const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
    let tentativas = 0;
    let palpite;

    do {
        let entrada = prompt("Adivinhe o número entre 1 e 100 (ou digite 'x' para sair):");
        palpite = parseInt(entrada);
        tentativas++;

        if (palpite < numeroAleatorio) {
            console.log("Mais alto!");
        }
        else if (entrada === "x") {
            console.log("Você saiu do jogo.");
            return;
        } else if (palpite > numeroAleatorio) {
            console.log("Mais baixo!");
        } else if (palpite === numeroAleatorio) {
            console.log(`Parabéns! Você acertou em ${tentativas} tentativas.`);
        }
    } while (palpite !== numeroAleatorio);
}
// Teste a função
jogoAdivinhacao();
