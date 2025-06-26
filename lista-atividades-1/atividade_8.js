// 8. Escreva um algoritmo para ler 2 valores(considere que não serão lidos valores iguais)
// e escreve - los em ordem crescente.

const prompt = require('prompt-sync')();
const a = parseFloat(prompt('Digite o primeiro valor: '));
const b = parseFloat(prompt('Digite o segundo valor: '));
if (a < b) {
    console.log(`Os valores em ordem crescente são: ${a}, ${b}`);
}
else {
    console.log(`Os valores em ordem crescente são: ${b}, ${a}`);
}	    