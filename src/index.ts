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

app.get("/users", (req: Request, res: Response) => {
  try {
    res.status(200).send(user);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/users/:id/purchases", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("Usuário não existe");
    }
    const result: TPurchase[] = purchase.filter((item) => item.userId === id);
    res.status(200).send(result);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products", (req: Request, res: Response) => {
  try {
    res.status(200).send(product);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/search", (req: Request, res: Response) => {
  try {
    const query = req.query.q;

    if (query === undefined) {
      if (query.length < 0) {
        res.status(400);
        throw new Error("Deve possuir pelo menos um caractere");
      }
      res.status(400);
      throw new Error("Deve ser uma string");
    }

    if (typeof query === "string") {
      const result = product.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      res.status(200).send(result);
    }
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/products/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (product.find((item) => item.id === id) === undefined) {
      res.status(400);
      throw new Error("Produto não encontrado");
    }
    res.status(200).send(product.find((item) => item.id === id));
  } catch (error) {}
});

app.post("/users", (req: Request, res: Response) => {
  //   const newUser: TUser = {
  //     id: req.body.id as string,
  //     email: req.body.email as string,
  //     password: req.body.password as string,
  //   };

  try {
    const { id, email, password } = req.body;

    if (
      user.find((item) => item.id === id) !== undefined ||
      user.find((item) => item.email == email) !== undefined
    ) {
      res.status(400);
      throw new Error("Usuario já está cadastrado");
    }
    user.push({ id, email, password });
    res.status(201).send("Cadastro realizado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/products", (req: Request, res: Response) => {
  //   const newProduct: TProduct = {
  //     id: req.body.id as string,
  //     name: req.body.name as string,
  //     price: req.body.price as number,
  //     category: req.body.category as string,
  //   };

  try {
    const { id, name, price, category } = req.body;

    if (product.find((item) => item.id === id) !== undefined) {
      res.status(400);
      throw new Error("Produto já cadastrado");
    }
    product.push({ id, name, price, category });
    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/purchases", (req: Request, res: Response) => {
  //   const newPurchases: TPurchase = {
  //     userId: req.body.userId as string,
  //     productId: req.body.productId as string,
  //     quantity: req.body.quantity as number,
  //     totalPrice: req.body.totalPrice as number,
  //   };
  try {
    const { userId, productId, quantity, totalPrice } = req.body;

    if (user.find((item) => item.id === userId) === undefined) {
      res.status(400);
      throw new Error("O id do usuario não está cadastrado");
    }
    if (product.find((item) => item.id === productId) === undefined) {
      res.status(400);
      throw new Error("O id do produto não está cadastrado");
    }
    if (quantity <= 0) {
      res.status(400);
      throw new Error("A quantidade total de compras deve ser maior que 0");
    }

    purchase.push({ userId, productId, quantity, totalPrice });
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
