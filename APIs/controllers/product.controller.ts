import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

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
    static allProduct(req: Request, res: Response, next: NextFunction) {
        Product.find()
            .then((result: any) => {
                res.status(200).json({ success: true, message: "All products:", data: result });
            })
            .catch((err: any) => {
                console.log(err)
                next(err)
            })
    }
    static listByCategory(req: Request, res: Response, next: NextFunction) {
        Product.find({ category: req.params.category })
            .then((result: any) => {
                res.status(200).json({ success: true, message: "Products by Category:", data: result });
            })
            .catch((err: any) => {
                console.log(err)
                next(err)
            });
    }
    static productDetails(req: Request, res: Response, next: NextFunction) {
        Product.findById(req.params.product_id)
            .then((result: any) => {
                res.status(200).json({ success: true, message: "Product details:", data: result });
            })
            .catch((err: any) => {
                console.log(err)
                next(err)
            });
    }
    static async addToCart(req: Request, res: Response, next: NextFunction) {
        const customer_id = await (<any>req).customer_id;
        const product_id = req.params.product_id;
        const orderIsExsist: any = await Order.countDocuments({ customer_id: customer_id, product_id: product_id })
        const product: any = await Product.findById(product_id);
        const productName = product.name;
        const priceTag: number = product.priceTag;
        const productStock: number = product.stock
        const quantity: number = await req.body.quantity;
        const measureStock: number = productStock - quantity
        const totalPrice: number = priceTag * quantity;
        const notes = await req.body.notes
        let createOrder: any;
        let increment: any;
        let sendData: any;
        let decreaseStock: any;

        try {
            // console.log(typeof (orderIsExsist))
            // console.log("orederExistCount: " + orderIsExsist)
            if (measureStock < 0) {
                res.status(400).json({ success: false, message: `Insufficient stock available.Product stock remaining: ${productStock}`, data: product })
            } else if (orderIsExsist == 1) {
                const existedOrder: any = await Order.findOne({ customer_id: customer_id, product_id: product_id })
                const order_id = existedOrder.id
                // console.log("orderId: " + order_id)
                // console.log("increment:" + sendData)
                increment = await Order.findByIdAndUpdate(order_id, { $inc: { quantity: quantity, totalPrice: totalPrice } }, { new: true })
                sendData = increment
            } else {
                // console.log("orderIsNotExist")
                createOrder = await Order.create({
                    customer_id: customer_id,
                    product_id: product_id,
                    productName: productName,
                    quantity: quantity,
                    notes: notes,
                    priceTag: priceTag,
                    totalPrice: totalPrice
                })
                sendData = createOrder
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            decreaseStock = await Product.findByIdAndUpdate(product_id, { $inc: { stock: -quantity } }, { new: true })
            console.log("decrease:" + decreaseStock)
            res.status(201).json({ success: true, message: "Success add to cart!", data: sendData })
        }
    }
}


export default productController