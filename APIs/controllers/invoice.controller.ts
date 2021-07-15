import { Request, Response, NextFunction } from 'express'
import { Invoice } from '../models/Invoice'
import { Product } from '../models/Product'
import { User } from '../models/User'


class invoiceController {
    static listInvoices(req: Request, res: Response, next: NextFunction) {
        Invoice.find({ user_id: (<any>req).user_id, status: { $in: ["unpaid", "paid", "shipping", "trouble"] } })

            .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' })
                }
                res.status(200).json({ success: true, message: "Invoices:", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
    static invoiceDetails(req: Request, res: Response, next: NextFunction) {
        Invoice.findById(req.params.invoice_id)
            .then((result: any) => {
                res.status(200).json({ success: true, message: "Invoice details:", data: result });
            })
            .catch((err: any) => {
                console.log(err)
                next(err)
            });
    }
    static async confirmPayment(req: Request, res: Response, next: NextFunction) {
        const invoice: any = await Invoice.findById(req.params.invoice_id)
        const insertCode: any = req.body.insert_code
        const orders: any = invoice?.orders;
        let success = false;
        let updateStatus: any;
        let pushInvoiceId: any;

        try {
            if (insertCode == "123" && invoice.paymentStatus == "unpaid") {
                updateStatus = await Invoice.findByIdAndUpdate(req.params.invoice_id, { status: "paid" }, { new: true });
                success = true
                // pushInvoiceId = await User.findByIdAndUpdate((<any>req).user_id, { $push: { invoices: req.params.invoice_id } }, { new: true })
            } else {
                res.status(500).json({ success: false, message: "Wrong code" })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            if (success) {
                for (let item = 0; item < orders.length; item++) {
                    let updateStock;
                    let product_id = orders[item].product_id
                    let quantity = orders[item].quantity
                    updateStock = await Product.findByIdAndUpdate(product_id, { $inc: { stock: -quantity } }, { new: true });
                }
                res.status(201).json({ success: true, message: "Invoice updated", data: updateStatus })
            }
        }
    }
    static async confirmShipment(req: Request, res: Response, next: NextFunction) {
        const invoice: any = await Invoice.findById(req.params.invoice_id)
        const checkStatus: any = invoice?.status
        const confirmation: string = req.body.confirm_shipment
        let status: any;
        let updateShipping: any;

        try {
            if (confirmation == "arrived") status = "arrived"
            else if (confirmation == "not arrived" && checkStatus == "shipping") status = "trouble"
            else status = checkStatus
            updateShipping = await Invoice.findByIdAndUpdate(req.params.invoice_id, { status: status }, { new: true });
            res.status(201).json({ success: true, message: "Invoice updated", data: updateShipping })
        }
        catch (err) {
            next(err)
        }
    }
    static purchasementHistory(req: Request, res: Response, next: NextFunction) {
        Invoice.find({ user_id: (<any>req).user_id, shippingStatus: "arrived" })

            .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' })
                }
                res.status(200).json({ success: true, message: "Purchasement history:", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
}

export default invoiceController