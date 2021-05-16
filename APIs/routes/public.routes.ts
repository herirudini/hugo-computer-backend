import { Router } from 'express'
// import IRoutes from './IRoutes'
import customerController from '../controllers/customer.controller'
import productController from '../controllers/product.controller'

import auth from '../middlewares/authJwt'

class publicRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.home()
        this.listByCategory()
        this.productDetails()
        this.signup()
        this.login()
    }
    public home(): void {
        this.router.get('/home', productController.allProduct)
    }
    public listByCategory(): void {
        this.router.get('/products/:category', productController.listByCategory);
    }
    public productDetails(): void {
        this.router.get('/products/:category/:product_id', productController.productDetails);
    }
    public signup(): void {
        this.router.post('/signup', auth.uniqueData, customerController.signup)
    }
    public login(): void {
        this.router.put('/login', customerController.login)
    }  
}

export default new publicRouter().router