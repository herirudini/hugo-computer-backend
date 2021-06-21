import { Request, Response, NextFunction } from 'express'
import { Invoice } from '../models/Invoice'
import { User } from '../models/User'


class invoiceController {
    static listInvoices(req: Request, res: Response, next: NextFunction) {
        Invoice.find({ user_id: (<any>req).user_id, shippingStatus: { $in: ["on process", "trouble", "standby"] } })

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
        let updateStatus: any;
        let pushInvoiceId: any;

        try {
            if (insertCode == "123" && invoice.paymentStatus == "unpaid") {
                updateStatus = await Invoice.findByIdAndUpdate(req.params.invoice_id, { paymentStatus: "paid-off", shippingStatus: "on process" }, { new: true });
                pushInvoiceId = await User.findByIdAndUpdate((<any>req).user_id, { $push: { invoices: req.params.invoice_id } }, { new: true })
            } else {
                res.status(500).json({ success: false, message: "Wrong code" })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Invoice updated", data: updateStatus })
        }
    }
    static async confirmShipment(req: Request, res: Response, next: NextFunction) {
        const invoice: any = await Invoice.findById(req.params.invoice_id)
        const checkStatus: any = invoice.shippingStatus
        const confirmation: string = req.body.confirm_shipment
        let shippingStatus: any;
        let updateShipping: any;

        try {
            if (confirmation == "arrived") shippingStatus = "arrived"
            else if (confirmation == "not arrived" && checkStatus == "on process") shippingStatus = "trouble"
            else shippingStatus = checkStatus
            updateShipping = await Invoice.findByIdAndUpdate(req.params.invoice_id, { shippingStatus: shippingStatus }, { new: true })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Invoice updated", data: updateShipping })
        }
    }
    static historyInvoices(req: Request, res: Response, next: NextFunction) {
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