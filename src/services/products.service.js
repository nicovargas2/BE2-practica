import { productDao } from '../dao/mongo/product.dao.js';

class ProductsServices {
    async getAll(filter, options) {
        return await productDao.getAll(filter, options);
    }

    async getById(id) {
        //ejemplo de como deberiamos hacerlo
        //const product = await productDao.getById(id);
        //if (!product) throw new Error('Product not found');

        return await productDao.getById(id);
    }

    async create(data) {
        return await productDao.create(data);
    }

    async update(id, data) {
        return await productDao.update(id, data);
    }

    async deleteOne(id) {
        return await productDao.deleteOne(id);
    }
}

export const productsServices = new ProductsServices();
