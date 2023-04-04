-- Active: 1679962955574@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

SELECT * from users;

INSERT INTO users 
VALUES
("u001", "becca@gmail", "123"),
("u002", "catiuzi@gmail", "321"),
("u003", "jojo@gmail", "231");

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
('p001', 'fone', 150, 'Acessórios'),
('p002', 'camisa', 200, 'Roupas e calçados'),
('p003', 'tv', 300, 'Eletrônicos'),
('p004', 'play4', 500, 'Eletrônicos'),
('p005', 'monitor', 50, 'Eletrônicos');



-------- exercicio --------
SELECT * FROM users;

SELECT * FROM products;

SELECT * FROM products
WHERE name LIKE "%monitor%";

INSERT INTO users
VALUES 
("u004", 'jolyne@gmail', 312);

INSERT INTO products
VALUES 
("p006", 'dark souls', 100, 'Eletrônicos');

SELECT * FROM products
WHERE id LIKE "%1%";

DELETE FROM users
WHERE id = 4;

DELETE FROM products
WHERE id = 6;

UPDATE users
SET
    password = 111
WHERE id = 1;

UPDATE products
SET
    price = 1000000
WHERE id = 1;

SELECT * FROM users
ORDER BY email ASC;

SELECT * FROM products
ORDER BY price ASC
LIMIT 20;

SELECT * FROM products
WHERE price >= 100 AND price <= 300
ORDER BY price ASC;