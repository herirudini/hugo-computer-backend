"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("../models/Order");
const Address_1 = require("../models/Address");
const Invoice_1 = require("../models/Invoice");
const Product_1 = require("../models/Product");
class orderController {
    static listOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderList;
            try {
                orderList = yield Order_1.Order.find({ user_id: req.user_id });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Your order list:", data: orderList });
            }
        });
    }
    static editOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderItem = yield Order_1.Order.findById(req.params.order_id);
            const product_id = orderItem.product_id;
            const product = yield Product_1.Product.findById(product_id);
            const productStock = product.stock;
            const quantity = orderItem.quantity;
            const newQuantity = yield req.body.quantity;
            const newNotes = yield req.body.notes;
            const newTotalPrice = orderItem.priceTag * newQuantity;
            const newStock = quantity - newQuantity;
            const measureStock = productStock + newStock;
            let updateOrder;
            let updateStock;
            try {
                if (measureStock < 0) {
                    res.status(400).json({ success: false, message: `Insufficient stock available. Product stock remaining: ${productStock}`, data: product });
                }
                else {
                    updateOrder = yield Order_1.Order.findByIdAndUpdate(req.params.order_id, { quantity: newQuantity, notes: newNotes, totalPrice: newTotalPrice }, { new: true });
                    updateStock = yield Product_1.Product.findByIdAndUpdate(product_id, { $inc: { stock: newStock } }, { new: true });
                    next();
                }
            }
            finally {
                console.log("Order updated: " + updateOrder);
            }
        });
    }
    static deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderItem = yield Order_1.Order.findById(req.params.order_id);
            const product_id = orderItem.product_id;
            const quantity = orderItem.quantity;
            let updateStock;
            let deleteOrderItem;
            try {
                updateStock = yield Product_1.Product.findByIdAndUpdate(product_id, { $inc: { stock: quantity } }, { new: true });
            }
            finally {
                deleteOrderItem = yield Order_1.Order.findByIdAndDelete(req.params.order_id);
                console.log("One order deleted");
                next();
            }
        });
    }
    static generateInvoice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user_id;
            const address = yield Address_1.Address.findOne({ user_id: user_id, status: "default address" });
            const countOrder = yield Order_1.Order.countDocuments({ user_id: user_id });
            const orderList = yield Order_1.Order.find({ user_id: user_id });
            const paymentMethod = yield req.body.payment_method;
            const shippingMethod = yield req.body.shipping_method;
            let bills = 0;
            let transferCode;
            let createInvoice;
            let wipeOrderList;
            (paymentMethod == "BTC" || paymentMethod == "Transfer") ? transferCode = "1230987654321" : false;
            try {
                if (countOrder < 1) {
                    res.status(400).json({ success: false, message: "your cart is empty" });
                }
                else if (!paymentMethod || !shippingMethod) {
                    res.status(400).json({ success: false, message: "please input payment and shipping method first!" });
                }
                else {
                    for (let i in orderList) {
                        bills += orderList[i].totalPrice;
                    }
                    ;
                    createInvoice = yield Invoice_1.Invoice.create({
                        user_id: user_id,
                        bills: bills,
                        paymentMethod: paymentMethod,
                        transferCode: transferCode,
                        shippingMethod: shippingMethod,
                        address: address,
                        orderList: orderList,
                    });
                    wipeOrderList = yield Order_1.Order.deleteMany({ user_id: user_id });
                    res.status(201).json({ success: true, message: "Check your invoice. Pay your bills via transfer to the bank number listed below:", data: createInvoice });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
}
exports.default = orderController;
