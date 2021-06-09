"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = __importDefault(require("../controllers/address.controller"));
class addressRouter {
    constructor() {
        this.router = express_1.Router();
        this.listAddress();
        this.createAddress();
        this.checkAddress();
        this.editAddress();
        this.deleteAddress();
    }
    listAddress() {
        this.router.get('/address', address_controller_1.default.listAddress);
    }
    createAddress() {
        this.router.post('/address', address_controller_1.default.createAddress, address_controller_1.default.listAddress);
    }
    checkAddress() {
        this.router.get('/address/:address_id', address_controller_1.default.checkAddress);
    }
    editAddress() {
        this.router.patch('/address/:address_id', address_controller_1.default.setDefaultAddress);
    }
    deleteAddress() {
        this.router.delete('/address/:address_id', address_controller_1.default.deleteAddress, address_controller_1.default.listAddress);
    }
}
exports.default = new addressRouter().router;
