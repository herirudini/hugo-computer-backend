import { Order } from '../models/Order'
import { Address } from '../models/Address'
import { Invoice } from '../models/Invoice'
import { Product } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

class orderController {
    static async autoMarkupOrder(req: Request, res: Response, next: NextFunction) {
        const orderList = await Order.find({ user_id: (<any>req).user_id })

        try {
            for (let i = 0; i < orderList.length; i++) {
                let product = await Product.findById(orderList[i].product_id);
                let stock: any = product?.stock;
                let quantity: any = orderList[i].quantity;
                let measureStock = stock - quantity
                if (measureStock < 0) {
                    await Order.findByIdAndUpdate(orderList[i]._id, { quantity: stock }, { new: true })
                }
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Your order list:", data: orderList })
        }
    }
    static listOrder(req: Request, res: Response, next: NextFunction) {
        Order.find({ user_id: (<any>req).user_id })
            .then((result) => {
                res.status(200).json({ success: true, message: "order list:", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static async editOrder(req: Request, res: Response, next: NextFunction) {
        const orderItem: any = await Order.findById(req.params.order_id)
        const product_id: any = orderItem.product_id
        const product: any = await Product.findById(product_id);
        const productStock: number = product.stock
        const quantity: number = orderItem.quantity
        const inputQuantity: any = await req.body.quantity
        const newNotes: any = await req.body.notes;
        const newTotalPrice: number = orderItem.priceTag * inputQuantity
        const newStock: number = quantity - inputQuantity
        const measureStock: number = productStock + newStock

        let updateOrder;
        // let updateStock;
        try {
            if (measureStock < 0) {
                res.status(400).json({ success: false, message: `Insufficient stock available. Product stock remaining: ${productStock}`, data: product })
            } else {
                updateOrder = await Order.findByIdAndUpdate(req.params.order_id, { quantity: inputQuantity, notes: newNotes, totalPrice: newTotalPrice }, { new: true })
                // updateStock = await Product.findByIdAndUpdate(product_id, { $inc: { stock: newStock } }, { new: true })
                res.status(200).json({ success: true, message: "order updated", data: updateOrder })
            }
        }
        catch (err) {
            next(err)
        }
    }
    static async cancelOrder(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const orderItem: any = await Order.findById(req.params.order_id)
        // const product_id: any = orderItem.product_id
        // const quantity: number = orderItem.quantity
        // let updateStock: any;
        let cancelOrderItem: any;
        try {
            cancelOrderItem = await Order.findByIdAndUpdate(req.params.order_id, { status: "cancel" }, { new: true });
            res.status(200).json({ success: true, message: "order canceled" })
            // updateStock = await Product.findByIdAndUpdate(product_id, { $inc: { stock: quantity } }, { new: true });
        }
        catch (err) {
            next(err)
        }
    }
    static async checkout(req: Request, res: Response, next: NextFunction) {
        const user_id = (<any>req).user_id;
        const address = await Address.findOne({ user_id: user_id, status: "default address" })
        const countOrder = await Order.countDocuments({ user_id: user_id, status: "on-process" });
        const orderList = await Order.find({ user_id: user_id, status: "on-process" });
        const paymentMethod = await req.body.payment_method;
        const shippingMethod = await req.body.shipping_method;
        let bills: number = 0;
        let transferCode: any;
        let createInvoice: any;
        let wipeOrderList: any;
        let errMessage: string = "";
        let success = true
        let understock = false;
        let understockMessage: string = "";

        (paymentMethod == "BTC" || paymentMethod == "Transfer") ? transferCode = "1230987654321" : false

        try {
            if (countOrder < 1) {
                success = false
                errMessage += "your cart is empty"
                // res.status(404).json({ success: false, message: "your cart is empty" })
            } else if (!paymentMethod || !shippingMethod) {
                success = false
                errMessage += "please input payment and shipping method first!"
                // res.status(400).json({ success: false, message: "please input payment and shipping method first!" })
            } else {
                for (let i in orderList) {
                    let product: any = await Product.findById(orderList[i].product_id)
                    let quantity = orderList[i].quantity
                    let measureStock = product?.stock - quantity;
                    if (measureStock < 0) {
                        understockMessage += product.name + "_"
                        understock = true;
                        success = false;
                    } else {
                        bills += orderList[i].totalPrice
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        } finally {
            if (understock) {
                res.status(500).json({ success: false, message: `${understockMessage} stock is unavailable` })
            } else if (success) {
                createInvoice = await Invoice.create({
                    user_id: user_id,
                    bills: bills,
                    paymentMethod: paymentMethod,
                    transferCode: transferCode,
                    shippingMethod: shippingMethod,
                    address: address,
                    orderList: orderList,
                })
                wipeOrderList = await Order.updateMany({ user_id: user_id, status: "on-process" }, { status: "passed" }, { new: true });
                res.status(201).json({ success: true, message: "Check your invoice. Pay your bills via transfer to the bank number listed below:", data: createInvoice })
            } else {
                res.status(400).json({ success: false, message: errMessage })
            }
        }
    }
}

export default orderController