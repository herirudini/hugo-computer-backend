import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { User } from '../models/User'
import { Order } from '../models/Order'
import { Invoice } from '../models/Invoice'
import { Message } from '../models/Message'


class auth {
    static loginValidator(req: Request, res: Response, next: NextFunction) {
        User.exists({ email: (<any>req).body.email })
            .then((result) => {
                if (!result) {
                    throw ({ name: 'not_verified' })
                } else
                    next()
            })
            .catch((err) => {
                next(err)
            })
    }
    static async authentication(req: Request, res: Response, next: NextFunction) {
        const access_token: string = (<any>req).headers.access_token;
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

        try {

            if (!access_token) {
                console.log("Incorrect Token: Please Login")
                throw ({ name: 'missing_token' })

            } else {
                jwt.verify(access_token, process.env.TOKEN as string, (err, decoded: any) => {
                    if (err) {
                        throw ({ name: 'invalid_token' })
                    }
                    (<any>req).user_id = decoded.id;
                })
                const author: any = await User.findById((<any>req).user_id);
                const logIp = author.logIp;
                let ipExist = logIp.includes(ip)

                if (ipExist == false) {
                    throw ({ name: 'unauthorized' })
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
        const checkEmail: any = await User.find({ email: req.body.new_email })
        const checkPhone: any = await User.find({ phone: req.body.new_phone })
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
        const author: any = await User.findById((<any>req).user_id).select('+password')

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
            } else if ((<any>req).user_id != message.user_id) {
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
            } else if ((<any>req).user_id != order.user_id) {
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
            } else if ((<any>req).user_id != invoice.user_id) {
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
    static async adminAuth(req: Request, res: Response, next: NextFunction) {
        const author: any = await User.findById((<any>req).user_id).select('+password')

        try {
            if (!author.isAdmin) {
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