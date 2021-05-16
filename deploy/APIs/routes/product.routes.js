"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IRoutes from './IRoutes'
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class productRouter {
    constructor() {
        this.router = express_1.Router();
        this.allProduct();
        this.listByCategory();
        this.productDetails();
        this.authentication();
        this.addToChart();
    }
    allProduct() {
        this.router.get('/products', product_controller_1.default.allProduct);
    }
    listByCategory() {
        this.router.get('/products/:category', product_controller_1.default.listByCategory);
    }
    productDetails() {
        this.router.get('/products/:category/:product_id', product_controller_1.default.productDetails);
    }
    authentication() {
        this.router.use(authJwt_1.default.authentication);
    }
    addToChart() {
        this.router.post('/products/:category/:product_id', product_controller_1.default.addToCart);
    }
}
exports.default = new productRouter().router;
