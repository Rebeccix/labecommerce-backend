-- Active: 1681770398160@@127.0.0.1@3306
DROP TABLE users;
DROP TABLE products;
DROP TABLE purchases;
DROP TABLE purchases_products;
-- create tables --

-- create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (DATETIME())
);

-- create products table
CREATE TABLE products (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- create purchases table
CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (DATETIME()),  
    paid INTEGER NOT NULL DEFAULT(0),   
    FOREIGN KEY (buyer) REFERENCES users(id) 
);

-- create purchases_products table
CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT(1),
    FOREIGN KEY (purchase_id) REFERENCES purchase (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- insert into to create table --

-- create users
INSERT INTO users
VALUES
('u001', 'user1@gmail.com', '123456'),
('u002', 'user2@gmail.com', '654321'),
('u003', 'user3@gmail.com', '615243');

-- create products
INSERT INTO products
VALUES
('2ann2tm1', 'fone', 15.00, 'Acessórios', 'imageurl4');
-- ('p002', 'camisa', 20.00, 'Roupas e calçados'),
-- ('p003', 'tv', 300.00, 'Eletrônicos'),
-- ('p004', 'play4', 5000.00, 'Eletrônicos'),
-- ('p005', 'monitor', 100.00, 'Eletrônicos');

-- create purchases
INSERT INTO purchases (id, total_price, buyer_id)
VALUES
('up001', 20.00, 'u001'),
('up002', 300.00, 'u001'),
('up003', 5000.00, 'u002'),
('up004', 100.00, 'u003');

-- create purchases_products
INSERT INTO purchases_products
VALUES
('275515ry', 'eliv9xfr', 2),
('275515ry', '2ann2tm1', 1),
('bpn5hgg0', '5nkn6rm7', 1),
('9kikrzs8', 'befvpg59', 1);

-- get tables -- 

-- get all users
SELECT * FROM users;

-- get all products
SELECT * FROM products;

-- get all purchases
SELECT * FROM purchases;

-- get all purchases_products
SELECT * FROM purchases_products;

-- get products by name
SELECT * FROM products
WHERE name LIKE '%monitor%';

-- get products by id
SELECT * FROM products
WHERE id LIKE '%1%';

-- get all users in ascending order by email
SELECT * FROM users
ORDER BY email ASC;

-- get all products in ascending order by price, limit 20
SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;

-- get all products in ascending order by price, between two numbers
SELECT * FROM products
WHERE price >= 20 AND price <= 300
ORDER BY price ASC;

-- get all purchases and users united by id 
SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id;

-- get all purchases_products, purchases and products united by id
SELECT * FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;

-- insert new values --

-- insert into users
INSERT INTO users
VALUES 
('u004', 'user4@gmail.com', '342516');

-- insert into products
INSERT INTO products
VALUES
('p006', 'ventilador', 50, 'Eletrônicos');

-- update --

-- update user by id
UPDATE users
SET 
    password = '225534'
WHERE id = 'u004';

-- update product by id
UPDATE products
SET 
    price = 11.50
WHERE id = 'p006';

-- update purchase by id
UPDATE purchases
SET 
    delivered_at = DATETIME()
WHERE id = 'up001';

-- delete -- 

-- delete user by id
DELETE FROM users 
WHERE id = 'u004';

-- delete product by id
DELETE FROM products 
WHERE id = 'p006';