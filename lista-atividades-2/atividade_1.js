// 1. Validação de Datas
// Crie a função ehDataValida(dia, mes, ano) que retorne true se os valores
// formarem uma data real(meses de 28–31 dias, ano bissexto para
// fevereiro) e false caso contrário.

// Verifica se o ano é bissexto
function ehAnoBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
}

// Verifica se a data é válida
function ehDataValida(dia, mes, ano) {
    if (ano < 0 || mes < 1 || mes > 12 || dia < 1) {
        console.log("Data inválida: valores fora do intervalo permitido.");
        return false;
    }

    const diasPorMes = [31, (ehAnoBissexto(ano) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (dia > diasPorMes[mes - 1]) {
        console.log(`Data inválida: o mês ${mes} no ano ${ano} não tem ${dia} dias.`);
        return false;
    }

    return true;
}

// Testes
console.log(ehDataValida(29, 2, 2020)); // true (ano bissexto)
console.log(ehDataValida(29, 2, 2021)); // false
console.log(ehDataValida(31, 4, 2021)); // false (abril tem 30 dias)
console.log(ehDataValida(31, 12, 2021)); // true
