import { Order } from '../models/Order'
import { Address } from '../models/Address'
import { Invoice } from '../models/Invoice'
import { Product } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

class orderController {
    static async listOrder(req: Request, res: Response, next: NextFunction) {
        let orderList;

        try {
            orderList = await Order.find({ user_id: (<any>req).user_id })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Your order list:", data: orderList })
        }
    }
    static async editOrder(req: Request, res: Response, next: NextFunction) {
        const orderItem: any = await Order.findById(req.params.order_id)
        const product_id: any = orderItem.product_id
        const product: any = await Product.findById(product_id);
        const productStock: number = product.stock
        const quantity: number = orderItem.quantity
        const newQuantity: any = await req.body.quantity
        const newNotes: any = await req.body.notes;
        const newTotalPrice: number = orderItem.priceTag * newQuantity
        const newStock: number = quantity - newQuantity
        const measureStock: number = productStock + newStock

        let updateOrder;
        let updateStock;
        try {
            if (measureStock < 0) {
                res.status(400).json({ success: false, message: `Insufficient stock available. Product stock remaining: ${productStock}`, data: product })
            } else {
                updateOrder = await Order.findByIdAndUpdate(req.params.order_id, { quantity: newQuantity, notes: newNotes, totalPrice: newTotalPrice }, { new: true })
                updateStock = await Product.findByIdAndUpdate(product_id, { $inc: { stock: newStock } }, { new: true })
                next()
            }
        }
        finally {
            console.log("Order updated: " + updateOrder)
        }
    }
    static async deleteOrder(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const orderItem: any = await Order.findById(req.params.order_id)
        const product_id: any = orderItem.product_id
        const quantity: number = orderItem.quantity
        let updateStock: any;
        let deleteOrderItem: any;
        try {
            updateStock = await Product.findByIdAndUpdate(product_id, { $inc: { stock: quantity } }, { new: true });
        }
        finally {
            deleteOrderItem = await Order.findByIdAndDelete(req.params.order_id)
            console.log("One order deleted")
            next()
        }
    }
    static async generateInvoice(req: Request, res: Response, next: NextFunction) {
        const user_id = (<any>req).user_id;
        const address = await Address.findOne({ user_id: user_id, status: "default address" })
        const countOrder = await Order.countDocuments({ user_id: user_id });
        const orderList = await Order.find({ user_id: user_id });
        const paymentMethod = await req.body.payment_method;
        const shippingMethod = await req.body.shipping_method;
        let bills: number = 0;
        let transferCode: any;
        let createInvoice: any;
        let wipeOrderList: any;
        (paymentMethod == "BTC" || paymentMethod == "Transfer") ? transferCode = "1230987654321" : false

        try {
            if (countOrder < 1) {
                res.status(400).json({ success: false, message: "your cart is empty" })
            } else if (!paymentMethod || !shippingMethod) {
                res.status(400).json({ success: false, message: "please input payment and shipping method first!" })
            } else {
                for (let i in orderList) {
                    bills += orderList[i].totalPrice
                };
                createInvoice = await Invoice.create({
                    user_id: user_id,
                    bills: bills,
                    paymentMethod: paymentMethod,
                    transferCode: transferCode,
                    shippingMethod: shippingMethod,
                    address: address,
                    orderList: orderList,
                })
                wipeOrderList = await Order.deleteMany({ user_id: user_id });
                res.status(201).json({ success: true, message: "Check your invoice. Pay your bills via transfer to the bank number listed below:", data: createInvoice })
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
}

export default orderController