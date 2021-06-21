import { User } from '../models/User'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'


class userController {
    static async signup(req: Request, res: Response) {
        let createUser: any;
        try {
            createUser = await User.create({
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
            res.status(201).json({ success: true, message: "signup success: please login", data: createUser })
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {
        const user: any = await User.findOne({ email: (<any>req).body.email }).select('+password');
        const passwordIsValid: any = bcrypt.compareSync((<any>req).body.password, user.password);
        const token: string = jwt.sign({ id: user.id }, process.env.TOKEN as string)
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        const logIp = user.logIp;
        let ipExist = logIp.includes(ip)
        let updateCredentials: any;

        try {
            if (!passwordIsValid) {
                throw ({ name: 'not_verified' })
            } else if (!ipExist) { //true email and password
                updateCredentials = await User.findOneAndUpdate({ email: req.body.email }, { $push: { logIp: ip } }, { new: true });
                res.status(202).json({ success: true, message: "success login", data: user, token })
            } else {
                res.status(202).json({ success: true, message: "success login", data: user, token })
            }
        }
        catch (err) {
            console.log(err);
            next(err)
        }
    }
    static async logout(req: Request, res: Response, next: NextFunction) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let updateCredentials: any;
        try {
            console.log("berhasil masuk logout controller")
            updateCredentials = await User.findByIdAndUpdate((<any>req).user_id, { $pull: { logIp: ip } }, { new: true });
        }
        catch (err) {
            console.log(err)
            next(err)
        }
        finally {
            res.status(401).json({ success: true, message: "Success logout" })
        }
    }
    static async myDetails(req: Request, res: Response, next: NextFunction) {
        User.findById((<any>req).user_id).populate(['invoices', 'address', 'wishlist'])

            .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' })
                }
                res.status(200).json({ success: true, message: "User data", data: result });
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
        User.findByIdAndUpdate((<any>req).user_id, newData, { new: true })
            .then((result) => {
                res.status(200).json({ success: true, message: "Email/Phone changed! Please Login", data: result });
                next()
            })
            .catch((err) => {
                res.status(422).json({ success: false, message: err });
            })
    }
    static changePassword(req: Request, res: Response, next: NextFunction) {
        User.findByIdAndUpdate((<any>req).user_id, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
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

export default userController