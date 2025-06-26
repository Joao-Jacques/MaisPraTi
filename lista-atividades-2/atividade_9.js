// 9. Conversão Entre Formatos
// Escreva duas funções:
// 1. ○ paresParaObjeto(pares) recebe um array de pares[[chave,valor], ... ] e retorna o objeto equivalente.
// 2. ○ objetoParaPares(obj) faz o inverso, retornando um array de pares.

// Função que converte array de pares em objeto
function paresParaObjeto(pares) {
    return Object.fromEntries(pares);
}

// Função que converte objeto em array de pares
function objetoParaPares(obj) {
    return Object.entries(obj);
}

// Exemplos de uso:
const pares = [['a', 1], ['b', 2], ['c', 3]];
const obj = paresParaObjeto(pares);
console.log(obj); // { a: 1, b: 2, c: 3 }

const paresConvertidos = objetoParaPares(obj);
console.log(paresConvertidos); // [['a', 1], ['b', 2], ['c', 3]]
