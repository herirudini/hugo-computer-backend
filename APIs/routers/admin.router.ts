import { Router } from 'express'
// import IRoutes from './IRoutes'
import productController from '../controllers/product.controller'
import auth from '../middlewares/authJwt'

class adminRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createProduct()
    }
    public createProduct(): void {
        this.router.post('/product', productController.createProduct);
    }
}

export default new adminRouter().router