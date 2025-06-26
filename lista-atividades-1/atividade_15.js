// 15. Escreva um programa que gera e imprime os primeiros 10 números da sequência de
// Fibonacci utilizando um loop for.
let n = 10;
let fib = [0, 1];
for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
}
console.log(`Os primeiros ${n} números da sequência de Fibonacci são: ${fib.join(', ')}`);
