import { Router } from 'express'
import userRouter from './user.routes'
import adminRouter from './admin.routes'
import addressRouter from './address.routes'
import messageRouter from './message.routes'
import orderRouter from './order.routes'
import invoiceRouter from './invoice.routes'

import productController from '../controllers/product.controller'
import userController from '../controllers/user.controller'

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
        this.admin()
        this.user()
        this.address()
        this.message()
        this.order()
        this.invoice()
        this.logout()
        this.errorHandler()
    }
    public signup(): void {
        this.router.post('/signup', auth.uniqueData, userController.signup)
    }
    public login(): void {
        this.router.put('/login', auth.loginValidator, userController.login)
    }
    public products(): void {
        this.router.get('/product', productController.allProduct)
    }
    public productCategory(): void {
        this.router.get('/product/:category', productController.listByCategory);
    }
    public productDetails(): void {
        this.router.get('/product/:category/:product_id', productController.productDetails);
    }
    public authentication(): void {
        this.router.use(auth.authentication)
    }
    public addToCart(): void {
        this.router.post('/product/:category/:product_id', productController.addToCart);
    }
    public admin(): void {
        this.router.use('/admin', auth.adminAuth, adminRouter)
    }
    public order(): void {
        this.router.use(orderRouter)
    }
    public user(): void {
        this.router.use(userRouter)
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
        this.router.patch('/logout', userController.logout)
    }
    public errorHandler(): void {
        this.router.use(errorHandler);
    }
}

export default new Routes().router