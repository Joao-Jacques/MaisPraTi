// 9. Implemente um programa que exibe uma contagem regressiva de 10 até 1 no console
// utilizando um loop for.

for (let i = 10; i >= 1; i--) {
    setTimeout(() => {
        console.log(i);
    }, (10 - i) * 1000);
}
