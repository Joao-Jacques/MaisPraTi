// 4. Crie um menu interativo no console que oferece ao usuário a escolha de três opções.
// Utilize switch-case para implementar a lógica de cada opção selecionada.

const prompt = require('prompt-sync')();
const menu = `
Escolha uma opção:
1. Adição
2. Subtração
3. Multiplicação
4. Divisão
5. Sair
`;
let opcao;

do {
    console.log(menu);
    opcao = parseInt(prompt('Digite sua opção: '));

    switch (opcao) {
        case 1:
            const num1 = parseFloat(prompt('Digite o primeiro número: '));
            const num2 = parseFloat(prompt('Digite o segundo número: '));
            console.log(`Resultado: ${num1 + num2}`);
            break;
        case 2:
            const num3 = parseFloat(prompt('Digite o primeiro número: '));
            const num4 = parseFloat(prompt('Digite o segundo número: '));
            console.log(`Resultado: ${num3 - num4}`);
            break;
        case 3:
            const num5 = parseFloat(prompt('Digite o primeiro número: '));
            const num6 = parseFloat(prompt('Digite o segundo número: '));
            console.log(`Resultado: ${num5 * num6}`);
            break;
        case 4:
            const num7 = parseFloat(prompt('Digite o primeiro número: '));
            const num8 = parseFloat(prompt('Digite o segundo número: '));
            if (num8 !== 0) {
                console.log(`Resultado: ${num7 / num8}`);
            } else {
                console.log('Erro: Divisão por zero não é permitida.');
            }
            break;
        case 5:
            console.log('Saindo do programa...');
            break;
        default:
            console.log('Opção inválida. Tente novamente.');
    }
} while (opcao !== 5);
