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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = require("../models/Customer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
class customerController {
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let createCustomer;
            try {
                createCustomer = yield Customer_1.Customer.create({
                    phone: req.body.new_phone,
                    email: req.body.new_email,
                    password: bcrypt_1.default.hashSync(req.body.new_password, 8),
                    name: req.body.name,
                });
            }
            catch (err) {
                res.status(422).json({ success: false, message: "signup failed!", data: err });
            }
            finally {
                res.status(201).json({ success: true, message: "signup success: please login", data: createCustomer });
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer_1.Customer.findOne({ email: req.body.email }).select('+password');
            const passwordIsValid = bcrypt_1.default.compareSync(req.body.password, customer.password);
            const token = jwt.sign({ id: customer.id }, process.env.TOKEN);
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            const logIp = customer.logIp;
            let ipExist = logIp.includes(ip);
            let signCredentials;
            let credentialsData;
            ipExist ? credentialsData = { logToken: token } : credentialsData = { $push: { logIp: ip }, logToken: token };
            try {
                // console.log(typeof(logIp))
                console.log("login Controller Ip exist?: " + ipExist);
                if (!customer) { //wrong email
                    throw ({ name: 'not_verified' });
                }
                else if (passwordIsValid) { //true email and password
                    signCredentials = yield Customer_1.Customer.findOneAndUpdate({ email: req.body.email }, credentialsData, { new: true });
                    res.status(202).json({ success: true, message: "success login", data: signCredentials, AccessToken: token });
                    // res.redirect('../home'); THIS IS ERROR: auth.atuhentication is triggered by idk why
                }
                else { //true email, wrong password
                    throw ({ name: 'not_verified' });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            let signCredentials;
            try {
                console.log("berhasil masuk logout controller");
                signCredentials = yield Customer_1.Customer.findByIdAndUpdate(req.customer_id, { $pull: { logIp: ip }, logToken: "" }, { new: true });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
            finally {
                res.status(401).json({ success: true, message: "Success logout" });
                // res.redirect('../login')
            }
        });
    }
    static myDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Customer_1.Customer.findById(req.customer_id).populate(['invoices', 'address', 'wishlist'])
                .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' });
                }
                res.status(200).json({ success: true, message: "Customer data", data: result });
            })
                .catch((err) => {
                next(err);
            });
        });
    }
    static changeEmailOrPhone(req, res, next) {
        const { new_phone, new_email } = req.body;
        const newData = { phone: new_phone, email: new_email };
        for (const key in newData) {
            if (!newData[key])
                delete newData[key];
        }
        Customer_1.Customer.findByIdAndUpdate(req.customer_id, newData, { new: true })
            .then((result) => {
            res.status(200).json({ success: true, message: "Email/Phone changed! Please Login", data: result });
            next();
        })
            .catch((err) => {
            res.status(422).json({ success: false, message: err });
        });
    }
    static changePassword(req, res, next) {
        Customer_1.Customer.findByIdAndUpdate(req.customer_id, { password: bcrypt_1.default.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
            res.status(200).json({ success: true, message: "Password changed! Please Login" });
            next();
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
}
exports.default = customerController;
