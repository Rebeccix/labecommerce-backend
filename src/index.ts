import { db } from "./database/knex";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const result: {}[] = await db("users");
    res.status(200).send(result);
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/users/:id/purchases", async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const [purchaseExist]: {}[] = await db("purchases").where({ buyer: id });
      
      if (!id) {
        res.status(400);
        throw new Error("Usuário não existe");
      }

      res.status(200).send({ purchaseExist });
    } catch (error: any) {
      if (res.statusCode === 200) {
        res.status(500);
      }
      res.send(error.message);
    }
  }
);

app.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const result: {}[] = await db("products");
    res.status(200).send(result);
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/search", async (req: Request, res: Response): Promise<void> => {
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

      const result = await db("products").where("name", "like", `%${query}%`)

      res.status(200).send(result);
    }
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
  
    const [productsExist]: {}[] = await db("products").where({ id: id });

    if (!productsExist) {
      res.status(400);
      throw new Error("Produto não encontrado");
    }
    res.status(200).send(productsExist);
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/purchases/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const [purchaseExist]: any = await db
    .select(
      "purchases.id as purchaseId",
      "purchases.total_price as totalPrice",
      "users.createdAt as createdAt",
      "purchases.paid as isPaid",
      "purchases.buyer as buyerId",
      "users.name as name",
      "users.email as email"
    )
    .from("purchases")
    .innerJoin("users", "purchases.buyer", "=", "users.id")
    .where("purchases.id", "=", id);

  const productList = await db
    .select(
    "products.id as id",
    "products.name as name",
    "products.price as price",
    "products.description as description",
    "products.image_url as imageUrl",
    "purchases_products.quantity as quantity")
    .from("purchases_products")
    .join("purchases", "purchases_products.purchase_id", "=", "purchases.id")
    .join("products", "purchases_products.product_id", "=", "products.id")
    .where("purchases_products.purchase_id", "=", id);

    res.status(200).send({ ...purchaseExist, productList });
});

app.post("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = Math.floor(Date.now() * Math.random()).toString(36);
    const { name, email, password } = req.body;

    const [idExist]: {}[] = await db("users").where({ id: id });

    const [emailExist]: {}[] = await db("users").where({email: email})

    if (idExist || emailExist) {
      console.log(idExist);

      res.status(400);
      throw new Error("Usuario já está cadastrado");
    }

    const newUsers = {      
      id,
      name,
      email,
      password
    }

    await db
    .insert(newUsers)
    .into('users')

    res.status(201).send("Cadastro realizado com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, description, image_url } = req.body;
    const id: string = Math.floor(Date.now() * Math.random()).toString(36);

    const [productExist]: {}[] = await db('products').where({id:id})

    if (productExist) {
      res.status(400);
      throw new Error("Produto já cadastrado");
    }
    
    const newProducts = {
      id,
      name,
      price,
      description,
      image_url
    }

    await db
    .insert(newProducts)
    .into('products')

    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/purchases", async (req: Request, res: Response): Promise<void> => {
  try {
    const { buyer, total_price } = req.body;
    const id: string = Math.floor(Date.now() * Math.random()).toString(36);

    const [buyerExist]: {}[] = await db('users').where({id: buyer})

    if (!buyerExist) {
      res.status(400);
      throw new Error("O id do usuario não está cadastrado");
    }

    await db('purchases').insert({
      id,
      buyer,
      total_price,
    });

    res.status(201).send("Compra realizada com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.put("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const [userToModify]: {}[] = await db("users").where({ id: id });

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

    await db('users')
    .where({ id: id })
    .update({
      email,
      password
    });

    res.status(201).send("Cadastro atualizado com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.put("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const [productToModify]: {}[] = await db("products").where({ id: id });

    if (!name) {
      res.status(400);
      throw new Error("name está undefined");
    }
    if (isNaN(price)) {
      res.status(400);
      throw new Error("price está undefined");
    }
    if (!description) {
      res.status(400);
      throw new Error("category está undefined");
    }
    if (!productToModify) {
      res.status(400);
      throw new Error("Usuário a ser modificado não existe");
    }

    await db('products')
    .where({ id: id })
    .update({
      name,
      price,
      description
    });

    res.status(201).send("Cadastro atualizado com sucesso");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [userToDelete]: {}[] = await db("users").where({ id: id });

    if (!userToDelete) {
      res.status(400);
      throw new Error("O usuário não existe");
    }
    await db("users").where({id: id}).del()
    res.status(200).send("Usuario Deletado");
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.delete("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [productsToDelete]: {}[] = await db("products").where({ id: id });

    if (!productsToDelete) {
      res.status(400);
      throw new Error("Produto não existe");
    }
    await db("products").where({id: id}).del()
    res.status(200).send("Produto apagado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});