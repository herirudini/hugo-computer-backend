import { Customer } from '../models/Customer'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'


class customerController {
    static async signup(req: Request, res: Response) {
        let createCustomer: any;
        try {
            createCustomer = await Customer.create({
                phone: req.body.new_phone,
                email: req.body.new_email,
                password: bcrypt.hashSync(req.body.new_password, 8),
                name: req.body.name,
            }) 
        }
        catch (err) {
            res.status(422).json({ success: false, message: "signup failed!", data: err });
        }
        finally {
            res.status(201).json({ success: true, message: "signup success: please login", data: createCustomer })
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {
        const customer: any = await Customer.findOne({ email: (<any>req).body.email }).select('+password');
        const passwordIsValid: any = bcrypt.compareSync((<any>req).body.password, customer.password);
        const token: string = jwt.sign({ id: customer.id }, process.env.TOKEN as string)
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        const logIp = customer.logIp;
        let ipExist = logIp.includes(ip)
        let signCredentials: any;
        let credentialsData: any;
        ipExist ? credentialsData = { logToken: token } : credentialsData = { $push: { logIp: ip }, logToken: token };

        try {
            // console.log(typeof(logIp))
            console.log("login Controller Ip exist?: " + ipExist)
            if (!customer) { //wrong email
                throw ({ name: 'not_verified' })
            } else if (passwordIsValid) { //true email and password
                signCredentials = await Customer.findOneAndUpdate({ email: req.body.email }, credentialsData, { new: true });
                res.status(202).json({ success: true, message: "success login", data: signCredentials, AccessToken: token })
                // res.redirect('../home'); THIS IS ERROR: auth.atuhentication is triggered by idk why
            } else { //true email, wrong password
                throw ({ name: 'not_verified' })
            }
        }
        catch (err) {
            console.log(err);
            next(err)
        }
    }
    static async logout(req: Request, res: Response, next: NextFunction) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let signCredentials: any;
        try {
            console.log("berhasil masuk logout controller")
            signCredentials = await Customer.findByIdAndUpdate((<any>req).customer_id, { $pull: { logIp: ip }, logToken: "" }, { new: true });
        }
        catch (err) {
            console.log(err)
            next(err)
        }
        finally {
            res.status(401).json({ success: true, message: "Success logout" })
            // res.redirect('../login')
        }
    }
    static async myDetails(req: Request, res: Response, next: NextFunction) {
        Customer.findById((<any>req).customer_id).populate(['invoices', 'address', 'wishlist'])

            .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' })
                }
                res.status(200).json({ success: true, message: "Customer data", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
    static changeEmailOrPhone(req: Request, res: Response, next: NextFunction) {
        const { new_phone, new_email } = req.body;
        const newData: any = { phone: new_phone, email: new_email }
        for (const key in newData) {
            if (!newData[key]) delete newData[key]
        }
        Customer.findByIdAndUpdate((<any>req).customer_id, newData, { new: true })
            .then((result) => {
                res.status(200).json({ success: true, message: "Email/Phone changed! Please Login", data: result });
                next()
            })
            .catch((err) => {
                res.status(422).json({ success: false, message: err });
            })
    }
    static changePassword(req: Request, res: Response, next: NextFunction) {
        Customer.findByIdAndUpdate((<any>req).customer_id, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
                res.status(200).json({ success: true, message: "Password changed! Please Login" });
                next()
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }
    // User Cannot Delete Account
}

export default customerController