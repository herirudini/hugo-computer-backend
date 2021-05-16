import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Customer } from '../models/Customer'
import { Order } from '../models/Order'
import { Invoice } from '../models/Invoice'
import { Message } from '../models/Message'


class auth {
    static async authentication(req: Request, res: Response, next: NextFunction) {
        const access_token: string = (<any>req).headers.access_token;
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

        try {
            // console.log("access_tokennya: " + access_token)

            if (!access_token) {
                console.log("Incorrect Token: Please Login")
                throw ({ name: 'missing_token' })
                // res.redirect('../../login')

            } else {
                jwt.verify(access_token, process.env.TOKEN as string, (err, decoded: any) => {
                    if (err) {
                        throw ({ name: 'invalid_token' })
                    }
                    (<any>req).customer_id = decoded.id;
                })
                const author: any = await Customer.findById((<any>req).customer_id);
                const logToken = author.logToken;
                const logIp = author.logIp;
                let ipExist = logIp.includes(ip)

                if (ipExist == false || logToken != access_token) {
                    throw ({ name: 'invalid_token' })
                    // res.redirect('../login');
                } else {
                    console.log("berhasil lewat Authentication")
                    next();
                }
            }
        }
        catch (err) {
            console.log("masuk catch auth:" + err)
            next(err)
        }
    }
    static async uniqueData(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const checkEmail: any = await Customer.find({ email: req.body.new_email })
        const checkPhone: any = await Customer.find({ phone: req.body.new_phone })
        try {
            if (checkEmail.length != 0) {
                throw ({ name: 'unique_email' })
            } else if (checkPhone.length != 0) {
                throw ({ name: 'unique_phone' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async twoStepAuth(req: Request, res: Response, next: NextFunction) {
        const author: any = await Customer.findById((<any>req).customer_id).select('+password')

        try {
            if (!req.body.password) {
                res.status(402).json({ success: false, message: "Please input password!" })
            } else {
                const match = bcrypt.compareSync(req.body.password, author.password);
                if (!match) {
                    throw ({ name: 'twostep_auth' })
                } else {
                    next()
                }
            } 
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async messageAuthor(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const message: any = await Message.findById(req.params.message_id)
        try {
            if (!message) {
                throw ({ name: 'not_found' })
            } else if ((<any>req).customer_id != message.customer_id) {
                throw ({ name: 'unauthorized' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async orderAuthor(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const order: any = await Order.findById(req.params.order_id)
        try {
            if (!order) {
                throw ({ name: 'not_found' })
            } else if ((<any>req).customer_id != order.customer_id) {
                throw ({ name: 'unauthorized' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async invoiceAuthor(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const invoice: any = await Invoice.findById(req.params.invoice_id)
        try {
            if (!invoice) {
                throw ({ name: 'not_found' })
            } else if ((<any>req).customer_id != invoice.customer_id) {
                throw ({ name: 'unauthorized' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
}

export default auth