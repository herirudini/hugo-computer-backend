import { Router } from 'express'
// import IRoutes from './IRoutes'
import productController from '../controllers/product.controller'
import auth from '../middlewares/authJwt'

class productRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.allProduct()
        this.listByCategory()
        this.productDetails()
        this.authentication()
        this.addToChart()
    }

    public allProduct(): void {
        this.router.get('/products', productController.allProduct);
    }
    public listByCategory(): void {
        this.router.get('/products/:category', productController.listByCategory);
    }
    public productDetails(): void {
        this.router.get('/products/:category/:product_id', productController.productDetails);
    }
    public authentication(): void {
        this.router.use(auth.authentication)
    }
    public addToChart(): void {
        this.router.post('/products/:category/:product_id', productController.addToCart);
    }
}

export default new productRouter().router
