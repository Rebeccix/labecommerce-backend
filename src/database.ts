import { TUser, TProduct, TPurchase } from "./types";

export enum CATEGORY {
  ACCESSORIES = "Acessórios",
  CLOTHES_AND_SHOES = "Roupas e calçados",
  ELECTRONICS = "Eletrônicos"
}

export const user: Array<TUser> = [
  {
    id: "u001",
    email: "becca@gmail",
    password: "123",
  },
  {
    id: "u002",
    email: "catiuzi@gmail",
    password: "321",
  },
];

export const product: Array<TProduct> = [
  {
    id: "p001",
    name: "tv",
    price: 5,
    category: CATEGORY.ELECTRONICS,
  },
  {
    id: "p002",
    name: "brinco",
    price: 2,
    category: CATEGORY.ACCESSORIES,
  },
];

export const purchase: Array<TPurchase> = [
  {
    userId: "u001",
    productId: "p001",
    quantity: 2,
    totalPrice: 10,
  },
  {
    userId: "u002",
    productId: "p00 2",
    quantity: 5,
    totalPrice: 10,
  },
];

export const createUser = (id: string, email: string, password: string) => {
  let newUser = {
    id,
    email,
    password
  }

  user.push(newUser)
  return "Cadastro realizado com sucesso"
}

export const getAllUsers  = (): TUser[] => {
  return user
}

export const createProduct = (id: string, name: string, price: number, category: string) => {
  let newProduct = {
    id,
    name,
    price,
    category
  }

  product.push(newProduct)
  return "Produto criado com sucesso"
}

export const getAllProducts = (): TProduct[] => {
  return product
}

export const getProductById = (id: string): TProduct[] => {
  return [product.find(item => item.id === id)]
}

//  exe 3 

export const queryProductsByName = (q: string): TProduct[] => {
  return [product.find(item => item.name === q)]
}

export const createPurchase = (userId: string, productId: string, quantity: number, totalPrice: number) => {
  let newPurchase = {
    userId,
    productId,
    quantity,
    totalPrice
  }

  purchase.push(newPurchase)
  return "Compra realizada com sucesso"
}

export const getAllPurchasesFromUserId = (id: string): TPurchase[] => {
  return [purchase.find(item => item.userId === id)]
}