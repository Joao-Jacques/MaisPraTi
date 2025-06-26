// 7. As maçãs custam R$ 0, 30 se forem compradas menos do que uma dúzia, e R$ 0, 25 se
// forem compradas pelo menos doze.Escreva um algoritmo que leia o número de maçãs
// compradas, calcule e escreva o valor total da compra.

const prompt = require('prompt-sync')();
qtde_maca = parseInt(prompt('Digite a quantidade de maçãs compradas: '));
if (qtde_maca < 12) {
    valor = qtde_maca * 0.30;
}
else {
    valor = qtde_maca * 0.25;
}
console.log('O valor total da compra é: R$ ' + valor.toFixed(2));
