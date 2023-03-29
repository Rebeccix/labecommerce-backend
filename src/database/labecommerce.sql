-- Active: 1679962955574@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

SELECT * from users;

INSERT INTO users 
VALUES
(1, 'eu', 123),
(2, 'vc', 321),
(3, 'ele', 213);

-- produtos 
SELECT * from products;

CREATE TABLE products(
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO products
VALUES
(1, 'fone', 10, 'Acessórios'),
(2, 'camisa', 10, 'Roupas e calçados'),
(3, 'tv', 60, 'Eletrônicos'),
(4, 'play4', 0.99, 'Eletrônicos'),
(5, 'ventilador', 30, 'Eletrônicos');
