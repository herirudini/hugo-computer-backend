import { User } from '../models/User'
import { Address } from '../models/Address'
import { Request, Response, NextFunction } from 'express'

class addressController {
    static async createAddress(req: Request, res: Response, next: NextFunction) {
        const user_id: string = (<any>req).user_id;
        const checkAddress: number = await Address.countDocuments({ user_id: user_id });
        let status: string;
        checkAddress == 0 ? status = "default address" : status = "secondary address";
        let createAddress;
        let pushAddressId;
        try {
            if (checkAddress < 2) {
                createAddress = await Address.create({
                    user_id: user_id,
                    status: status,
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    zip: req.body.zip,
                    street: req.body.street,
                    details: req.body.details
                })
                pushAddressId = await User.findByIdAndUpdate(user_id, { $push: { address: createAddress.id } }, { new: true })
                res.status(201).json({ sucess: true, message: "New address created!", data: createAddress })
            } else {
                res.status(400).json({ success: false, message: "Cannot have address more than 2" })
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static listAddress(req: Request, res: Response, next: NextFunction) {
        Address.find({ user_id: (<any>req).user_id })
            .then((result) => {
                res.status(200).json({ success: true, message: "Address list", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
    static checkAddress(req: Request, res: Response, next: NextFunction) {
        Address.findById(req.params.address_id)
            .then((result) => {
                res.status(200).json({ success: true, message: "Address", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
    static async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
        const user_id: string = (<any>req).user_id
        let editOtherAddressStatus: any
        let editAddress: any;
        try {
            editOtherAddressStatus = await Address.findOneAndUpdate({ user_id: user_id, status: "default address" }, { status: "secondary address" }, { new: true })
        }
        catch (err) {
            next(err)
        }
        finally {
            editAddress = await Address.findByIdAndUpdate(req.params.address_id, {status: "default address"}, { new: true })
            res.status(200).json({ success: true, message: "Address updated", data: editAddress });
        }
    }
    static async deleteAddress(req: Request, res: Response, next: NextFunction) {
        const user_id: string = (<any>req).user_id
        const address: any = await Address.findById(req.params.address_id)
        let deleteAddress: any;
        let pullAddressId: any;
        try {
            if (address.status != "default address") {
                deleteAddress = await Address.findByIdAndDelete(req.params.address_id)
                pullAddressId = await User.findByIdAndUpdate(user_id, { $pull: { address: req.params.address_id } }, { new: true })
            } else {
                res.status(400).json({ success: false, message: "Cannot delete default address" })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(401).json({ success: true, message: "Address deleted!"});
        }
    }
}
export default addressController