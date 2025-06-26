// 2. Crie um programa que classifica a idade de uma pessoa em categorias(criança,
//     adolescente, adulto, idoso) com base no valor fornecido, utilizando uma estrutura de
//     controle if-else.

const prompt = require('prompt-sync')();
const idade = parseInt(prompt("Digite a idade da pessoa: "));
if (isNaN(idade)) {
    console.error("Erro: Por favor, digite uma idade válida.");
}
else {
    if (idade >= 0 && idade <= 12) {
        console.log("A pessoa é uma criança.");
    } else if (idade >= 13 && idade <= 17) {
        console.log("A pessoa é um adolescente.");
    } else if (idade >= 18 && idade <= 64) {
        console.log("A pessoa é um adulto.");
    } else if (idade >= 65) {
        console.log("A pessoa é um idoso.");
    } else {
        console.log("Idade inválida.");
    }
}