"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IRoutes from './IRoutes'
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class userRouter {
    constructor() {
        this.router = express_1.Router();
        this.myDetails();
        this.changeEmailOrPhone();
        this.changePassword();
    }
    myDetails() {
        this.router.get('/user', user_controller_1.default.myDetails);
    }
    changeEmailOrPhone() {
        this.router.patch('/user/change-email-phone', authJwt_1.default.twoStepAuth, authJwt_1.default.uniqueData, user_controller_1.default.changeEmailOrPhone, user_controller_1.default.logout);
    }
    changePassword() {
        this.router.put('/user/change-password', authJwt_1.default.twoStepAuth, user_controller_1.default.changePassword, user_controller_1.default.logout);
    }
}
exports.default = new userRouter().router;
