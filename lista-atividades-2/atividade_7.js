// 7. Mapeamento e Ordenação
// Dado um array produtos = [{ nome, preco }, ...], crie uma função que
// retorne um novo array apenas com os nomes, ordenados por preço
// crescente, usando map, sort.

function mapearEOrdenarPorPreco(produtos) {
    // Verifica se o array de produtos é válido
    if (!Array.isArray(produtos) || produtos.length === 0) {
        return [];
    }

    // Cria uma cópia do array e ordena por preço crescente
    const produtosOrdenados = [...produtos].sort((a, b) => a.preco - b.preco);

    // Mapeia os produtos ordenados para um novo array contendo apenas os nomes
    const nomes = produtosOrdenados.map(produto => produto.nome);

    // Retorna o array de nomes ordenados por preço
    return nomes;
}
// Exemplo de uso
const produtos = [
    { nome: 'Produto A', preco: 30 },
    { nome: 'Produto B', preco: 20 },
    { nome: 'Produto C', preco: 35 }
];
const nomesOrdenados = mapearEOrdenarPorPreco(produtos);
console.log(nomesOrdenados); // Saída: ['Produto B', 'Produto A', 'Produto C']