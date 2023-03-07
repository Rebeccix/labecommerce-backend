import { TUser, TProduct, TPurchase } from "./types";

export const user: Array<TUser> = [
  {
    id: "1",
    email: "@a",
    password: "123",
  },
  {
    id: "2",
    email: "@b",
    password: "321",
  },
];

export const product: Array<TProduct> = [
  {
    id: "1",
    name: "sefris",
    price: 5,
    category: "commander",
  },
  {
    id: "2",
    name: "bolt",
    price: 2,
    category: "instant",
  },
];

export const purchase: Array<TPurchase> = [
  {
    userId: "1",
    productId: "1",
    quantity: 2,
    totalPrice: 10,
  },
  {
    userId: "2",
    productId: "2",
    quantity: 5,
    totalPrice: 10,
  },
];
