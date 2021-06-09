"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IRoutes from './IRoutes'
const customer_controller_1 = __importDefault(require("../controllers/customer.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class customerRouter {
    constructor() {
        this.router = express_1.Router();
        this.myDetails();
        this.changeEmailOrPhone();
        this.changePassword();
    }
    myDetails() {
        this.router.get('/customer', customer_controller_1.default.myDetails);
    }
    changeEmailOrPhone() {
        this.router.patch('/customer/change-email-phone', authJwt_1.default.twoStepAuth, authJwt_1.default.uniqueData, customer_controller_1.default.changeEmailOrPhone, customer_controller_1.default.logout);
    }
    changePassword() {
        this.router.put('/customer/change-password', authJwt_1.default.twoStepAuth, customer_controller_1.default.changePassword, customer_controller_1.default.logout);
    }
}
exports.default = new customerRouter().router;
