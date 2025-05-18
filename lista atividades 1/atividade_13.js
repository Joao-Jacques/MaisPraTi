// 13. Fazer um algoritmo para receber números decimais até que o usuário digite 0 e fazer
// a média aritmética desses números.

const prompt = require('prompt-sync')();
let soma = 0;
let contador = 0;
let numero = parseFloat(prompt('Digite um número decimal (ou 0 para sair): '));

while (true) {
    if (isNaN(numero)) {
        console.log('Valor inválido. Por favor, digite um número decimal.');
    } else if (numero === 0) {
        break;
    } else {
        soma += numero;
        contador++;
    }
    numero = parseFloat(prompt('Digite um número decimal (ou 0 para sair): '));
}

if (contador > 0) {
    const media = soma / contador;
    console.log(`A média aritmética dos números digitados é: ${media}`);
} else {
    console.log('Nenhum número válido foi digitado.');
}
