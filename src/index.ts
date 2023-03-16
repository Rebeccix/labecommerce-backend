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

app.get('/users/:id/purchases', (req: Request, res: Response) => {
    const id: string = req.params.id
    const result: TPurchase[] = purchase.filter(item => item.userId === id)
    res.status(200).send(result)
})

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(product)
})

app.get('/products/search', (req: Request, res: Response) =>{
    res.status(200).send(req.query.q as string ? product.filter(item => item.name.toLowerCase().includes((req.query.q as string).toLowerCase())) : product)
})

app.get('/products/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const result: TProduct = product.find(item => item.id === id)
    res.status(200).send(result)
})

app.post('/users', (req: Request, res: Response) => {
    const newUser: TUser = {
        id: req.body.id as string,
        email: req.body.email as string,
        password: req.body.password as string
    }
    user.push(newUser)
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
    res.status(201).send("Compra realizada com sucesso")
})

app.put('/users/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const newEmail: string | undefined = req.body.email
    const newPassword: string | undefined = req.body.password
    const userToModify: TUser = user.find(item => item.id === id)

    if (userToModify) {
        userToModify.email = newEmail || userToModify.email; 
        userToModify.password = newPassword || userToModify.password; 
    }

    res.status(201).send("Cadastro atualizado com sucesso")
})

app.put('/products/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const newName : string | undefined = req.body.name
    const newPrice: number | undefined = req.body.price
    const newCategory: string | undefined = req.body.category
    const productToModify : TProduct = product.find(item => item.id === id)

    if (productToModify) {
        productToModify.name = newName || productToModify.name; 
        productToModify.price = newPrice || productToModify.price; 
        productToModify.category = newCategory || productToModify.category
    }

    res.status(201).send("Cadastro atualizado com sucesso")
})

app.delete('/users/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const index: number = user.findIndex(item => item.id === id)

    if(index >= 0) {
        user.splice(index, 1)
    }
    res.status(200).send("Usuario Deletado")
})

app.delete('/products/:id', (req: Request, res: Response) => {
    const id: string = req.params.id
    const index = product.findIndex(item => item.id === id)

    if(index >= 0) {
        product.splice(index, 1)
    }
    res.status(200).send("Produto apagado com sucesso")
})