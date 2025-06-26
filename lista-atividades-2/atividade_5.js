const { date } = require("zod");

function debounce(fn, delay) {
    let timeoutId;

    return function (...args) {
        // Cancela o timeout anterior, se existir
        clearTimeout(timeoutId);

        // Cria um novo timeout
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
function minhaFuncao() {
    console.log('Função executada!', new Date().toLocaleTimeString());
}

const funcDebounce = debounce(minhaFuncao, 5000);
//crie um console log da data atual
console.log('Data atual:', new Date().toLocaleString());

// Simula várias chamadas seguidas
funcDebounce(console.log('Chamada 1 agendada')); // chamada 1
funcDebounce(console.log('Chamada 2 agendada')); // chamada 2 (dentro do delay da 1, cancela a anterior)
funcDebounce(console.log('Chamada 3 agendada')); // chamada 3 (só essa será executada após 1 segundo)

