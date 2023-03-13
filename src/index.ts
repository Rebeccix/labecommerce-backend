import { product, purchase, user, createUser, getAllUsers, createProduct, getAllProducts, getProductById, CATEGORY, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from "./database";

console.table(user)
console.table(product)
console.table(purchase)

console.table(createUser('1', 'rebecca@', '312'))
console.table(getAllUsers())

console.table(createProduct('3', 'headset', 1, CATEGORY.ACCESSORIES))
console.table(getAllProducts())
console.table(getProductById('3'))

console.table(queryProductsByName('brinco'))
console.table(createPurchase("u003", "p004", 2, 1600))
console.table(getAllPurchasesFromUserId("u003"))