// 14. Crie um programa que calcula o fatorial de um número fornecido pelo usuário
// utilizando um loop for ou while.
const prompt = require('prompt-sync')();
let numero = parseInt(prompt('Digite um número inteiro para calcular o fatorial: '));

if (isNaN(numero)) {
    console.log('Por favor, digite um número válido.');
} else if (numero < 0) {
    console.log('Fatorial não é definido para números negativos.');
} else if (numero === 0) {
    console.log('O fatorial de 0 é 1.');
} else {
    let fatorial = 1;
    for (let i = 1; i <= numero; i++) {
        fatorial *= i;
    }
    console.log(`O fatorial de ${numero} é ${fatorial}.`);
}
