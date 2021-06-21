import { Router } from 'express'
// import IRoutes from './IRoutes'
import userController from '../controllers/user.controller'
import auth from '../middlewares/authJwt'

class userRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.myDetails()
        this.changeEmailOrPhone()
        this.changePassword()
    }
    public myDetails(): void {
        this.router.get('/user', userController.myDetails);
    }
    public changeEmailOrPhone(): void {
        this.router.patch('/user/change-email-phone', auth.twoStepAuth, auth.uniqueData, userController.changeEmailOrPhone, userController.logout);
    }
    public changePassword(): void {
        this.router.put('/user/change-password', auth.twoStepAuth, userController.changePassword, userController.logout);
    }
}

export default new userRouter().router