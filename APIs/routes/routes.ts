import { Router } from 'express'
import customerRouter from './customer.routes'
import addressRouter from './address.routes'
import messageRouter from './message.routes'
import orderRouter from './order.routes'
import invoiceRouter from './invoice.routes'

import productController from '../controllers/product.controller'
import customerController from '../controllers/customer.controller'

import errorHandler from '../middlewares/errorHandler'
import auth from '../middlewares/authJwt'

class Routes {
    router: Router
    constructor() {
        this.router = Router()
        this.products()
        this.signup()
        this.login()
        this.productCategory()
        this.productDetails()
        this.authentication()
        this.addToCart()
        this.customer()
        this.address()
        this.message()
        this.order()
        this.invoice()
        this.logout()
        this.errorHandler()
    }
    public signup(): void {
        this.router.post('/signup', auth.uniqueData, customerController.signup)
    }
    public login(): void {
        this.router.put('/login', customerController.login)
    }  
    public products(): void {
        this.router.get('/products', productController.allProduct)
    }
    public productCategory(): void {
        this.router.get('/products/:category', productController.listByCategory);
    }
    public productDetails(): void {
        this.router.get('/products/:category/:product_id', productController.productDetails);
    }
    public authentication(): void {
        this.router.use(auth.authentication)
    }
    public addToCart(): void {
        this.router.post('/products/:category/:product_id', productController.addToCart);
    }
    public order(): void {
        this.router.use(orderRouter)
    }
    public customer(): void {
        this.router.use(customerRouter)
    }
    public address(): void {
        this.router.use(addressRouter)
    }
    public message(): void {
        this.router.use(messageRouter)
    }
    public invoice(): void {
        this.router.use(invoiceRouter)
    }
    public logout(): void {
        this.router.patch('/logout', customerController.logout)
    }
    public errorHandler(): void {
        this.router.use(errorHandler);
    }
}

export default new Routes().router