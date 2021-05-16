import { Router } from 'express'
// import IRoutes from './IRoutes'
import customerController from '../controllers/customer.controller'
import auth from '../middlewares/authJwt'

class customerRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.myDetails()
        this.changeEmailOrPhone()
        this.changePassword()
    }
    public myDetails(): void {
        this.router.get('/customer', customerController.myDetails);
    }
    public changeEmailOrPhone(): void {
        this.router.patch('/customer/change-email-phone', auth.twoStepAuth, auth.uniqueData, customerController.changeEmailOrPhone, customerController.logout);
    }
    public changePassword(): void {
        this.router.put('/customer/change-password', auth.twoStepAuth, customerController.changePassword, customerController.logout);
    }
}

export default new customerRouter().router