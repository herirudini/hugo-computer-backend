import { Router } from 'express'
// import IRoutes from './IRoutes'
import orderController from '../controllers/order.controller'
import auth from '../middlewares/authJwt'

class userRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.listOrder()
        this.editOrder()
        this.cancelOrder()
        this.checkout()
    }
    public listOrder(): void {
        this.router.get('/cart', orderController.autoMarkupOrder, orderController.listOrder);
    }
    public editOrder(): void {
        this.router.patch('/cart/:order_id', auth.orderAuthor, orderController.editOrder);
    }
    public cancelOrder(): void {
        this.router.delete('/cart/:order_id', auth.orderAuthor, orderController.cancelOrder);
    }
    public checkout(): void {
        this.router.post('/cart/checkout', orderController.checkout); //push Orders to Invoice
    }
}

export default new userRouter().router
