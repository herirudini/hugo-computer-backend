"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IRoutes from './IRoutes'
const customer_controller_1 = __importDefault(require("../controllers/customer.controller"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class publicRouter {
    constructor() {
        this.router = express_1.Router();
        this.home();
        this.listByCategory();
        this.productDetails();
        this.signup();
        this.login();
    }
    home() {
        this.router.get('/home', product_controller_1.default.allProduct);
    }
    listByCategory() {
        this.router.get('/products/:category', product_controller_1.default.listByCategory);
    }
    productDetails() {
        this.router.get('/products/:category/:product_id', product_controller_1.default.productDetails);
    }
    signup() {
        this.router.post('/signup', authJwt_1.default.uniqueData, customer_controller_1.default.signup);
    }
    login() {
        this.router.put('/login', customer_controller_1.default.login);
    }
}
exports.default = new publicRouter().router;
