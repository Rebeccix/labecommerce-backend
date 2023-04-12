import {
  product,
  purchase,
  user,
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  getProductById,
  CATEGORY,
  queryProductsByName,
  createPurchase,
  getAllPurchasesFromUserId,
} from "./database";
import { db } from "./database/knex";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct, TPurchase, TUser } from "./types";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`SELECT * FROM users;`);
    res.status(200).send({ result });
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [purchaseExist]: {}[] = await db.raw(`SELECT * FROM purchases WHERE buyer = "${id}"`)

    if (!id) {
      res.status(400);
      throw new Error("Usuário não existe");
    }
    res.status(200).send({purchaseExist});
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`SELECT * FROM products;`);
    res.status(200).send({ result });
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q;

    if (query === undefined) {
      res.status(400);
      throw new Error("Deve ser uma string");
    }

    if (typeof query === "string") {
      if (query.length <= 0) {
        res.status(400);
        throw new Error("Deve possuir pelo menos um caractere");
      }
      const result = await db.raw(
        `SELECT * FROM products WHERE name LIKE '%${query}%'`
      );
      console.log(result)
      res.status(200).send({result});
    }
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [productsExist]: {}[] = await db.raw(`SELECT * FROM products WHERE id = "${id}";`)

    if (!productsExist) {
      res.status(400);
      throw new Error("Produto não encontrado");
    }
    res.status(200).send(productsExist);
  } catch (error: any) {}
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const id: string = Math.floor(Date.now() * Math.random()).toString(36);
    const { name, email, password } = req.body;

    const [idExist]: {}[] = await db.raw(
      `SELECT * FROM users WHERE id = "${id}";`
    );
    const [emailExist]: {}[] = await db.raw(
      `SELECT * FROM users WHERE email = "${email}";`
    );

    if (idExist || emailExist) {
      console.log(idExist);

      res.status(400);
      throw new Error("Usuario já está cadastrado");
    }

    await db.raw(
      `INSERT INTO users(id, name, email, password) VALUES ("${id}", "${name}", "${email}", "${password}");`
    );
    res.status(201).send("Cadastro realizado com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { name, price, description, image_url } = req.body;
    const id: string = Math.floor(Date.now() * Math.random()).toString(36);

    const [productExist]: {}[] = await db.raw(`SELECT * FROM products WHERE id = "${id}";`)
    
    if (productExist) {
      res.status(400);
      throw new Error("Produto já cadastrado");
    }
    await db.raw(`INSERT INTO products VALUES ("${id}", "${name}", "${price}", "${description}", "${image_url}");`)
    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
    try {
    const { buyer, total_price } = req.body;
    const id: string = Math.floor(Date.now() * Math.random()).toString(36);

    const [buyerExist]: {}[] = await db.raw(`SELECT * FROM users WHERE id = "${buyer}";`)

    if (!buyerExist) {
      res.status(400);
      throw new Error("O id do usuario não está cadastrado");
    }
    await db.raw(`INSERT INTO purchases(id, buyer, total_price) VALUES ("${id}", "${buyer}", "${total_price}");`)
    res.status(201).send("Compra realizada com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.put("/users/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const userToModify: TUser = user.find((item) => item.id === id);

    if (!email) {
      res.status(400);
      throw new Error("email está undefined");
    }
    if (!password) {
      res.status(400);
      throw new Error("password está undefined");
    }
    if (!userToModify) {
      res.status(400);
      throw new Error("Usuário a ser modificado não existe");
    }
    userToModify.email = email || userToModify.email;
    userToModify.password = password || userToModify.password;
    res.status(201).send("Cadastro atualizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.put("/products/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const productToModify: TProduct = product.find((item) => item.id === id);

    if (!name) {
      res.status(400);
      throw new Error("name está undefined");
    }
    if (isNaN(price)) {
      res.status(400);
      throw new Error("price está undefined");
    }
    if (!category) {
      res.status(400);
      throw new Error("category está undefined");
    }
    if (!productToModify) {
      res.status(400);
      throw new Error("Usuário a ser modificado não existe");
    }
    productToModify.name = name || productToModify.name;
    productToModify.price = price || productToModify.price;
    productToModify.category = category || productToModify.category;
    res.status(201).send("Cadastro atualizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index: number = user.findIndex((item) => item.id === id);

    if (user.find((item) => item.id === id) === undefined) {
      res.status(400);
      throw new Error("O usuário não existe");
    }
    if (index >= 0) {
      user.splice(index, 1);
    }
    res.status(200).send("Usuario Deletado");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index: number = product.findIndex((item) => item.id === id);

    if (product.find((item) => item.id === id) === undefined) {
      res.status(400);
      throw new Error("Produto não existe");
    }
    if (index >= 0) {
      product.splice(index, 1);
    }
    res.status(200).send("Produto apagado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// ------------------------------- //

app.post("/create-table-users", async (req: Request, res: Response) => {
  try {
    await db.raw(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (DATETIME())
    );
  `);

    res.status(200).send("Tabela users criada com sucesso!");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/create-table-products", async (req: Request, res: Response) => {
  try {
    await db.raw(`
      CREATE TABLE products (
        id TEXT PRIMARY KEY NOT NULL UNIQUE,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
      );
    `);

    res.status(200).send("Tabela products criada com sucesso!");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/create-table-purchases", async (req: Request, res: Response) => {
  try {
    await db.raw(`
      CREATE TABLE purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME()),  
        paid INTEGER NOT NULL DEFAULT(0),   
        FOREIGN KEY (buyer) REFERENCES users(id) 
      );
    `);

    res.status(200).send("Tabela purchases criada com sucesso!");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/create-table-purchases_products", async (req: Request, res: Response) => {
  try {
    await db.raw(`
      CREATE TABLE purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT(1),
        FOREIGN KEY (purchase_id) REFERENCES purchase (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `);

    res.status(200).send("Tabela purchases products criada com sucesso!");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});