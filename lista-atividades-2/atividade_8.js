// 8. Agrupamento por Propriedade
// Em vendas = [{ cliente, total }, ...], use reduce para gerar um objeto onde
// cada chave é um cliente e o valor é a soma de todos os seus total.

function agruparPorCliente(vendas) {
    // Verifica se o array de vendas é válido
    if (!Array.isArray(vendas) || vendas.length === 0) {
        return {};
    }

    // Usa reduce para agrupar as vendas por cliente
    return vendas.reduce((acumulador, venda) => {
        const { cliente, total } = venda;

        // Se o cliente já existe no acumulador, soma o total
        if (acumulador[cliente]) {
            acumulador[cliente] += total;
        } else {
            // Caso contrário, inicializa com o total da venda
            acumulador[cliente] = total;
        }

        return acumulador;
    }, {});
}
// Exemplo de uso
const vendas = [
    { cliente: 'João', total: 100 },
    { cliente: 'Maria', total: 200 },
    { cliente: 'João', total: 150 },
    { cliente: 'Ana', total: 300 }
];
const vendasAgrupadas = agruparPorCliente(vendas);
console.log(vendasAgrupadas);
// Saída: { João: 250, Maria: 200, Ana: 300 }
