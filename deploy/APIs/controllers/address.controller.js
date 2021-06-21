"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Address_1 = require("../models/Address");
class addressController {
    static createAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user_id;
            const checkAddress = yield Address_1.Address.countDocuments({ user_id: user_id });
            let status;
            checkAddress == 0 ? status = "default address" : status = "secondary address";
            let createAddress;
            let pushAddressId;
            try {
                if (checkAddress < 2) {
                    createAddress = yield Address_1.Address.create({
                        user_id: user_id,
                        status: status,
                        country: req.body.country,
                        state: req.body.state,
                        city: req.body.city,
                        zip: req.body.zip,
                        street: req.body.street,
                        details: req.body.details
                    });
                    pushAddressId = yield User_1.User.findByIdAndUpdate(user_id, { $push: { address: createAddress.id } }, { new: true });
                    res.status(201).json({ sucess: true, message: "New address created!", data: createAddress });
                }
                else {
                    res.status(400).json({ success: false, message: "Cannot have address more than 2" });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static listAddress(req, res, next) {
        Address_1.Address.find({ user_id: req.user_id })
            .then((result) => {
            res.status(200).json({ success: true, message: "Address list", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static checkAddress(req, res, next) {
        Address_1.Address.findById(req.params.address_id)
            .then((result) => {
            res.status(200).json({ success: true, message: "Address", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static setDefaultAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user_id;
            let editOtherAddressStatus;
            let editAddress;
            try {
                editOtherAddressStatus = yield Address_1.Address.findOneAndUpdate({ user_id: user_id, status: "default address" }, { status: "secondary address" }, { new: true });
            }
            catch (err) {
                next(err);
            }
            finally {
                editAddress = yield Address_1.Address.findByIdAndUpdate(req.params.address_id, { status: "default address" }, { new: true });
                res.status(200).json({ success: true, message: "Address updated", data: editAddress });
            }
        });
    }
    static deleteAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user_id;
            const address = yield Address_1.Address.findById(req.params.address_id);
            let deleteAddress;
            let pullAddressId;
            try {
                if (address.status != "default address") {
                    deleteAddress = yield Address_1.Address.findByIdAndDelete(req.params.address_id);
                    pullAddressId = yield User_1.User.findByIdAndUpdate(user_id, { $pull: { address: req.params.address_id } }, { new: true });
                }
                else {
                    res.status(400).json({ success: false, message: "Cannot delete default address" });
                }
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(401).json({ success: true, message: "Address deleted!" });
            }
        });
    }
}
exports.default = addressController;
