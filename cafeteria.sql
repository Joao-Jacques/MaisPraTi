-- 1. Tabela do cardápio de cafés
-- CARDÁPIO
CREATE TABLE Cardapio (
    cod_cardapio    INT PRIMARY KEY,
    nome_cafe       VARCHAR(100) UNIQUE NOT NULL,
    descricao       VARCHAR(255),
    preco_unitario  DECIMAL(10,2) NOT NULL
);

-- COMANDA
CREATE TABLE Comanda (
    cod_comanda INT PRIMARY KEY,
    data_venda  DATE NOT NULL,
    mesa        INT,
    cliente     VARCHAR(100) NOT NULL
);

-- ITENS DA COMANDA
CREATE TABLE Item_Comanda (
    cod_comanda     INT NOT NULL,
    cod_cardapio    INT NOT NULL,
    quantidade      INT NOT NULL,
    PRIMARY KEY (cod_comanda, cod_cardapio), -- impede repetir o mesmo café na mesma comanda
    FOREIGN KEY (cod_comanda)  REFERENCES Comanda(cod_comanda),
    FOREIGN KEY (cod_cardapio) REFERENCES Cardapio(cod_cardapio)
);

-- insert para popular a tabela Cardapio
INSERT INTO Cardapio (cod_cardapio, nome_cafe, descricao, preco_unitario)
VALUES
  (1, 'Café Expresso',       'Café curto, intenso',                          5.00),
  (2, 'Cappuccino',          'Café + leite vaporizado + espuma + canela',   8.50),
  (3, 'Latte',               'Café + bastante leite vaporizado',            9.00),
  (4, 'Mocha',               'Café + chocolate + leite + chantilly',       10.00),
  (5, 'Café Filtrado',       'Café coado tradicional',                       4.00);

-- insert para popular a tabela Comanda
INSERT INTO Comanda (cod_comanda, data_venda, mesa, cliente)
VALUES
  (100, '2025-10-27', 5,  'Ana Paula'),
  (101, '2025-10-27', 3,  'Bruno Silva'),
  (102, '2025-10-27', 7,  'Carlos Mendes'),
  (103, '2025-10-28', 2,  'Daniela Souza'),
  (104, '2025-10-28', 2,  'Daniela Souza');

-- insert para popular a tabela Item_Comanda
-- Comanda 100 (Ana Paula) pediu 2 Expressos e 1 Cappuccino
INSERT INTO Item_Comanda (cod_comanda, cod_cardapio, quantidade)
VALUES
  (100, 1, 2),  -- 2x Café Expresso (5.00 cada)
  (100, 2, 1);  -- 1x Cappuccino   (8.50)

-- Comanda 101 (Bruno Silva) pediu só 1 Latte
INSERT INTO Item_Comanda (cod_comanda, cod_cardapio, quantidade)
VALUES
  (101, 3, 1);  -- 1x Latte (9.00)

-- Comanda 102 (Carlos Mendes) pediu 1 Expresso e 1 Café Filtrado
INSERT INTO Item_Comanda (cod_comanda, cod_cardapio, quantidade)
VALUES
  (102, 1, 1),  -- 1x Expresso (5.00)
  (102, 5, 2);  -- 2x Café Filtrado (4.00)

-- Comanda 103 (Daniela Souza) pediu 1 Mocha e 1 Cappuccino
INSERT INTO Item_Comanda (cod_comanda, cod_cardapio, quantidade)
VALUES
  (103, 4, 1),  -- 1x Mocha (10.00)
  (103, 2, 1);  -- 1x Cappuccino (8.50)

-- Comanda 104 (Daniela Souza de novo) pediu só 3 Filtrados
INSERT INTO Item_Comanda (cod_comanda, cod_cardapio, quantidade)
VALUES
  (104, 5, 3);  -- 3x Café Filtrado (4.00)


-- 2. Consulta para listar todos os cafés do cardápio ordenados por nome
SELECT
    cod_cardapio,
    nome_cafe,
    descricao,
    preco_unitario
FROM Cardapio
ORDER BY nome_cafe;

-- 3. Consulta para listar todas as comandas com seus itens detalhados
SELECT
    c.cod_comanda,
    c.data_venda,
    c.mesa,
    c.cliente,
    ic.cod_comanda        AS item_cod_comanda,
    ca.nome_cafe,
    ca.descricao,
    ic.quantidade,
    ca.preco_unitario,
    (ic.quantidade * ca.preco_unitario) AS preco_total_item
FROM Comanda c
JOIN Item_Comanda ic
    ON c.cod_comanda = ic.cod_comanda
JOIN Cardapio ca
    ON ic.cod_cardapio = ca.cod_cardapio
ORDER BY
    c.data_venda,
    c.cod_comanda,
    ca.nome_cafe;

-- 4. Consulta para listar o total de vendas por comanda
SELECT
    c.cod_comanda,
    c.data_venda,
    c.mesa,
    c.cliente,
    SUM(ic.quantidade * ca.preco_unitario) AS total_comanda
FROM Comanda c
JOIN Item_Comanda ic
    ON c.cod_comanda = ic.cod_comanda
JOIN Cardapio ca
    ON ic.cod_cardapio = ca.cod_cardapio
GROUP BY
    c.cod_comanda,
    c.data_venda,
    c.mesa,
    c.cliente
ORDER BY
    c.data_venda;

-- 5. Consulta para listar comandas que possuem mais de um tipo de café
SELECT
    c.cod_comanda,
    c.data_venda,
    c.mesa,
    c.cliente,
    SUM(ic.quantidade * ca.preco_unitario) AS total_comanda
FROM Comanda c
JOIN Item_Comanda ic
    ON c.cod_comanda = ic.cod_comanda
JOIN Cardapio ca
    ON ic.cod_cardapio = ca.cod_cardapio
GROUP BY
    c.cod_comanda,
    c.data_venda,
    c.mesa,
    c.cliente
HAVING
    COUNT(DISTINCT ic.cod_cardapio) > 1
ORDER BY
    c.data_venda;

-- 6. Consulta para listar o faturamento total por dia
SELECT
    c.data_venda,
    SUM(ic.quantidade * ca.preco_unitario) AS faturamento_dia
FROM Comanda c
JOIN Item_Comanda ic
    ON c.cod_comanda = ic.cod_comanda
JOIN Cardapio ca
    ON ic.cod_cardapio = ca.cod_cardapio
GROUP BY
    c.data_venda
ORDER BY
    c.data_venda;
