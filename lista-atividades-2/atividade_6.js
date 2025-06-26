// 6. Memoization
// Implemente function memoize(fn) que armazene em cache chamadas
// anteriores de fn(por argumentos), retornando resultados instantâneos em
// repetidas invocações.
function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args); // Cria uma chave única para os argumentos

        if (cache.has(key)) {
            console.log('Resultado do cache:', cache.get(key));
            return cache.get(key); // Retorna o resultado do cache se existir
        }

        const result = fn(...args); // Chama a função original
        cache.set(key, result); // Armazena o resultado no cache
        console.log('Resultado calculado:', result);
        return result;
    };
}
// Exemplo de uso
function calcularFatorial(n) {
    if (n < 0) throw new Error('Número negativo não permitido');
    if (n === 0) return 1;
    return n * calcularFatorial(n - 1);
}
const fatorialMemoizado = memoize(calcularFatorial);
// Testando a função memoizada
console.log(fatorialMemoizado(5)); // Resultado calculado: 120
console.log(fatorialMemoizado(5)); // Resultado do cache: 120