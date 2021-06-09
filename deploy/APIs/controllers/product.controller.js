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
const Product_1 = require("../models/Product");
class productController {
    //     static uploadProduct(req: Request, res: Response, next: NextFunction) {
    //         Product.create({
    //             name: "Arduino Set",
    //         priceTag: 500,
    //         image: "https://lh3.googleusercontent.com/ZyL_u4kEv-IgQTqg8_Qf7rPcYzu_W-jwjRp9qNTWVSiFMErPQwYOEL2GJvaVYQwbybDxn4IrFgH6LraNk-jr2WRPvHLOqYrFCgF78HKBs0_x3ccvrC5HOT21kbDWEsKeP2B_sNEykQ=w1920-h1080",
    //         stockAvailable: 100,
    //         category: "Tools",
    //         description: "Arduino with lcd module and Breadboard included"
    //    })
    //             .then((result: any) => {
    //                 res.status(200).json({ message: "Upload One Product Herri Gantengs", data: result });
    //             })
    //             .catch((err: any) => {
    //                 console.log(err)
    //                 next(err)
    //             })
    //     }
    static allProduct(req, res, next) {
        Product_1.Product.find()
            .then((result) => {
            res.status(200).json({ success: true, message: "All products:", data: result });
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
    static listByCategory(req, res, next) {
        Product_1.Product.find({ category: req.params.category })
            .then((result) => {
            res.status(200).json({ success: true, message: "Products by Category:", data: result });
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
    static productDetails(req, res, next) {
        Product_1.Product.findById(req.params.product_id)
            .then((result) => {
            res.status(200).json({ success: true, message: "Product details:", data: result });
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
    static addToCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer_id = yield req.customer_id;
            const product_id = req.params.product_id;
            const orderIsExsist = yield Order_1.Order.countDocuments({ customer_id: customer_id, product_id: product_id });
            const product = yield Product_1.Product.findById(product_id);
            const productName = product.name;
            const priceTag = product.priceTag;
            const productImage = product.image;
            const productStock = product.stock;
            const quantity = yield req.body.quantity;
            const measureStock = productStock - quantity;
            const totalPrice = priceTag * quantity;
            const notes = yield req.body.notes;
            let createOrder;
            let increment;
            let sendData;
            let decreaseStock;
            try {
                // console.log(typeof (orderIsExsist))
                // console.log("orederExistCount: " + orderIsExsist)
                if (measureStock < 0) {
                    res.status(400).json({ success: false, message: `Insufficient stock available.Product stock remaining: ${productStock}`, data: product });
                }
                else if (orderIsExsist == 1) {
                    const existedOrder = yield Order_1.Order.findOne({ customer_id: customer_id, product_id: product_id });
                    const order_id = existedOrder.id;
                    // console.log("orderId: " + order_id)
                    // console.log("increment:" + sendData)
                    increment = yield Order_1.Order.findByIdAndUpdate(order_id, { $inc: { quantity: quantity, totalPrice: totalPrice } }, { new: true });
                    sendData = increment;
                }
                else {
                    // console.log("orderIsNotExist")
                    createOrder = yield Order_1.Order.create({
                        productImage: productImage,
                        customer_id: customer_id,
                        product_id: product_id,
                        productName: productName,
                        quantity: quantity,
                        notes: notes,
                        priceTag: priceTag,
                        totalPrice: totalPrice
                    });
                    sendData = createOrder;
                }
            }
            catch (err) {
                next(err);
            }
            finally {
                decreaseStock = yield Product_1.Product.findByIdAndUpdate(product_id, { $inc: { stock: -quantity } }, { new: true });
                console.log("decrease:" + decreaseStock);
                res.status(201).json({ success: true, message: "Success add to cart!", data: sendData });
            }
        });
    }
}
exports.default = productController;
