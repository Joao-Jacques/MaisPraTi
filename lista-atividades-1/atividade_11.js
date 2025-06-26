// 11. Escreva um programa que solicita ao usuário 5 números e calcula a soma total
// utilizando um loop for.
const prompt = require('prompt-sync')();
let soma = 0;
for (let i = 0; i < 5; i++) {
    let numero;
    while (true) {
        numero = parseFloat(prompt(`Digite o ${i + 1}º número: `));
        if (!isNaN(numero)) break;
        console.log("Valor inválido. Por favor, digite um número válido.");
    }
    soma += numero;
}
console.log(`A soma total dos números é: ${soma}`);