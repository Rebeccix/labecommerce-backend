import { product, purchase, user, createUser, getAllUsers, createProduct, getAllProducts, getProductById, CATEGORY, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from "./database";

import express, { Request, Response } from 'express'
import cors from 'cors'
import { TProduct, TPurchase, TUser } from "./types";

const app = express()

app.use(express.json())

app.use(cors())

app.listen(3003, () => {
    console.log("servidor rodando na porta 3003")    
});

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(user)
})

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(product)
})

app.get('/products/search', (req: Request, res: Response) =>{
  res.status(200).send(req.query.q as string ? product.filter(item => item.name.toLowerCase().includes((req.query.q as string).toLowerCase())) : product)
})

app.post('/users', (req: Request, res: Response) => {
    const newUser: TUser = {
        id: req.body.id as string,
        email: req.body.email as string,
        password: req.body.password as string
    }

    user.push(newUser)
    console.log(user)
    res.status(201).send("Cadastro realizado com sucesso")
})

app.post('/products', (req: Request, res: Response) => {
    const newProduct: TProduct = {
        id: req.body.id as string,
        name: req.body.name as string,
        price: req.body.price as number,
        category: req.body.category as string
    }

    product.push(newProduct)
    console.log(product)
    res.status(201).send("Produto cadastrado com sucesso")
})

app.post('/purchases', (req: Request, res: Response) => {
    const newPurchases: TPurchase = {
        userId: req.body.userId as string,
        productId: req.body.productId as string,
        quantity: req.body.quantity as number,
        totalPrice: req.body.totalPrice as number
    }

    purchase.push(newPurchases)
    console.log(purchase)
    res.status(201).send("Compra realizada com sucesso")
})