"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const address_routes_1 = __importDefault(require("./address.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const invoice_routes_1 = __importDefault(require("./invoice.routes"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.products();
        this.signup();
        this.login();
        this.productCategory();
        this.productDetails();
        this.authentication();
        this.addToCart();
        this.user();
        this.address();
        this.message();
        this.order();
        this.invoice();
        this.logout();
        this.errorHandler();
    }
    signup() {
        this.router.post('/signup', authJwt_1.default.uniqueData, user_controller_1.default.signup);
    }
    login() {
        this.router.put('/login', user_controller_1.default.login);
    }
    products() {
        this.router.get('/products', product_controller_1.default.allProduct);
    }
    productCategory() {
        this.router.get('/products/:category', product_controller_1.default.listByCategory);
    }
    productDetails() {
        this.router.get('/products/:category/:product_id', product_controller_1.default.productDetails);
    }
    authentication() {
        this.router.use(authJwt_1.default.authentication);
    }
    addToCart() {
        this.router.post('/products/:category/:product_id', product_controller_1.default.addToCart);
    }
    order() {
        this.router.use(order_routes_1.default);
    }
    user() {
        this.router.use(user_routes_1.default);
    }
    address() {
        this.router.use(address_routes_1.default);
    }
    message() {
        this.router.use(message_routes_1.default);
    }
    invoice() {
        this.router.use(invoice_routes_1.default);
    }
    logout() {
        this.router.patch('/logout', user_controller_1.default.logout);
    }
    errorHandler() {
        this.router.use(errorHandler_1.default);
    }
}
exports.default = new Routes().router;
