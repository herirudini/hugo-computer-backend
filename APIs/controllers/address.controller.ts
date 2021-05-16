import { Customer } from '../models/Customer'
import { Address } from '../models/Address'
import { Request, Response, NextFunction } from 'express'

class addressController {
    static async createAddress(req: Request, res: Response, next: NextFunction) {
        const customer_id: string = (<any>req).customer_id;
        const checkAddress: number = await Address.countDocuments({ customer_id: customer_id });
        let status: string;
        checkAddress == 0 ? status = "default address" : status = "secondary address";
        let createAddress;
        let pushAddressId;
        try {
            if (checkAddress < 2) {
                createAddress = await Address.create({
                    customer_id: customer_id,
                    status: status,
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    zip: req.body.zip,
                    street: req.body.street,
                    details: req.body.details
                })
                pushAddressId = await Customer.findByIdAndUpdate(customer_id, { $push: { address: createAddress.id } }, { new: true })
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
        Address.find({ customer_id: (<any>req).customer_id })
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
        const customer_id: string = (<any>req).customer_id
        let editOtherAddressStatus: any
        let editAddress: any;
        try {
            editOtherAddressStatus = await Address.findOneAndUpdate({ customer_id: customer_id, status: "default address" }, { status: "secondary address" }, { new: true })
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
        const customer_id: string = (<any>req).customer_id
        const address: any = await Address.findById(req.params.address_id)
        let deleteAddress: any;
        let pullAddressId: any;
        try {
            if (address.status != "default address") {
                deleteAddress = await Address.findByIdAndDelete(req.params.address_id)
                pullAddressId = await Customer.findByIdAndUpdate(customer_id, { $pull: { address: req.params.address_id } }, { new: true })
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