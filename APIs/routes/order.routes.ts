import { Router } from 'express'
// import IRoutes from './IRoutes'
import orderController from '../controllers/order.controller'
import auth from '../middlewares/authJwt'

class customerRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.listOrder()
        this.editOrder()
        this.deleteOrder()
        this.generateInvoice()
    }
    public listOrder(): void {
        this.router.get('/cart', orderController.listOrder); 
    }
    public editOrder(): void {
        this.router.patch('/cart/:order_id', auth.orderAuthor, orderController.editOrder, orderController.listOrder);
    }
    public deleteOrder(): void {
        this.router.delete('/cart/:order_id', auth.orderAuthor, orderController.deleteOrder, orderController.listOrder);
    }
    public generateInvoice(): void {
        this.router.post('/cart/checkout', orderController.generateInvoice); //push Orders to Invoice
    }
}

export default new customerRouter().router
