import { cartDao } from '../dao/mongo/cart.dao.js';
import { productDao } from '../dao/mongo/product.dao.js';

class CartsServices {

    async create() {
        return await cartDao.create();
    }

    async getById(cartId) {
        return await cartDao.getById(cartId);
    }

    async addProductToCart(cartId, productId) {
        const cart = await cartDao.getById(cartId);
        if (!cart) throw new Error('Cart not found');

        const productInCart = cart.products.find((element) => element.product._id == productId);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        return await cartDao.update(cartId, cart);
    }

    async deleteProductToCart(cartId, productId) {
        const cart = await cartDao.getById(cartId);
        cart.products = cart.products.filter((element) => element.product != productId);

        return await cartDao.update(cartId, { products: cart.products });
    }

    async updateQuantityProductInCart(cartId, productId, quantity) {
        const cart = await cartDao.findById(cartId);
        const product = cart.products.find((element) => element.product == productId);
        product.quantity = quantity;

        return await cartDao.update(cartId, { products: cart.products });
    }

    // Método para eliminar todos los productos de un carrito
    async clearProductsToCart(cartId) {
        const cart = await cartModel.findById(cartId);
        cart.products = [];

        return await cartDao.update(cartId, { products: [] });
    }

    async purchase(cart) {
        let total = 0;
        const productsWithoutStock = [];

        for (const productCart of cart.products) {
            const productDB = await productDao.getById(productCart.product);

            if (productDB.stock < productCart.quantity) {
                productsWithoutStock.push(productCart);
            } else {
                total += productDB.price * productCart.quantity;
                productDB.stock -= productCart.quantity;
                await productDao.update(productDB._id, { stock: productDB.stock });
                await cartDao.update(cart._id, { products: [] });
            }
        }

        if (productsWithoutStock.length > 0) {
            await cartDao.update(cart._id, { products: productsWithoutStock });
        }

        return total;
    }
}

export const cartsServices = new CartsServices();
