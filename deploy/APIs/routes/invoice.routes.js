"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import IRoutes from './IRoutes'
const invoice_controller_1 = __importDefault(require("../controllers/invoice.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class invoiceRouter {
    constructor() {
        this.router = express_1.Router();
        this.listInvoices();
        this.invoiceDetails();
        this.confirmPayment();
        this.confirmShipment();
        this.historyInvoices();
    }
    listInvoices() {
        this.router.get('/invoices/on-process', invoice_controller_1.default.listInvoices);
    }
    invoiceDetails() {
        this.router.get('/invoices/on-process/:invoice_id', authJwt_1.default.invoiceAuthor, invoice_controller_1.default.invoiceDetails);
    }
    confirmPayment() {
        this.router.put('/invoices/on-process/:invoice_id', authJwt_1.default.invoiceAuthor, invoice_controller_1.default.confirmPayment);
    }
    confirmShipment() {
        this.router.patch('/invoices/on-process/:invoice_id', authJwt_1.default.invoiceAuthor, invoice_controller_1.default.confirmShipment);
    }
    historyInvoices() {
        this.router.get('/invoices/history', invoice_controller_1.default.historyInvoices);
    }
}
exports.default = new invoiceRouter().router;
