"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IRoutes from './IRoutes'
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class userRouter {
    constructor() {
        this.router = express_1.Router();
        this.listOrder();
        this.editOrder();
        this.deleteOrder();
        this.generateInvoice();
    }
    listOrder() {
        this.router.get('/cart', order_controller_1.default.listOrder);
    }
    editOrder() {
        this.router.patch('/cart/:order_id', authJwt_1.default.orderAuthor, order_controller_1.default.editOrder, order_controller_1.default.listOrder);
    }
    deleteOrder() {
        this.router.delete('/cart/:order_id', authJwt_1.default.orderAuthor, order_controller_1.default.deleteOrder, order_controller_1.default.listOrder);
    }
    generateInvoice() {
        this.router.post('/cart/checkout', order_controller_1.default.generateInvoice); //push Orders to Invoice
    }
}
exports.default = new userRouter().router;
