// 1. Escreva um programa que recebe um número inteiro e verifica se ele é par ou ímpar
// utilizando uma estrutura de controle if.

const prompt = require('prompt-sync')();

const numero = parseInt(prompt("Digite um número inteiro: "));
if (isNaN(numero)) {
    console.error("Erro: Por favor, digite um número válido.");
} else {
    if (numero % 2 === 0) {
        console.log(`${numero} é par.`);
    } else {
        console.log(`${numero} é ímpar.`);
    }
}