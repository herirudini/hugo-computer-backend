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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Customer_1 = require("../models/Customer");
const Order_1 = require("../models/Order");
const Invoice_1 = require("../models/Invoice");
const Message_1 = require("../models/Message");
class auth {
    static authentication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const access_token = req.headers.access_token;
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            try {
                // console.log("access_tokennya: " + access_token)
                if (!access_token) {
                    console.log("Incorrect Token: Please Login");
                    throw ({ name: 'missing_token' });
                    // res.redirect('../../login')
                }
                else {
                    jwt.verify(access_token, process.env.TOKEN, (err, decoded) => {
                        if (err) {
                            throw ({ name: 'invalid_token' });
                        }
                        req.customer_id = decoded.id;
                    });
                    const author = yield Customer_1.Customer.findById(req.customer_id);
                    const logToken = author.logToken;
                    const logIp = author.logIp;
                    let ipExist = logIp.includes(ip);
                    if (ipExist == false || logToken != access_token) {
                        throw ({ name: 'invalid_token' });
                        // res.redirect('../login');
                    }
                    else {
                        console.log("berhasil lewat Authentication");
                        next();
                    }
                }
            }
            catch (err) {
                console.log("masuk catch auth:" + err);
                next(err);
            }
        });
    }
    static uniqueData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkEmail = yield Customer_1.Customer.find({ email: req.body.new_email });
            const checkPhone = yield Customer_1.Customer.find({ phone: req.body.new_phone });
            try {
                if (checkEmail.length != 0) {
                    throw ({ name: 'unique_email' });
                }
                else if (checkPhone.length != 0) {
                    throw ({ name: 'unique_phone' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static twoStepAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield Customer_1.Customer.findById(req.customer_id).select('+password');
            try {
                if (!req.body.password) {
                    res.status(402).json({ success: false, message: "Please input password!" });
                }
                else {
                    const match = bcrypt_1.default.compareSync(req.body.password, author.password);
                    if (!match) {
                        throw ({ name: 'twostep_auth' });
                    }
                    else {
                        next();
                    }
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static messageAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield Message_1.Message.findById(req.params.message_id);
            try {
                if (!message) {
                    throw ({ name: 'not_found' });
                }
                else if (req.customer_id != message.customer_id) {
                    throw ({ name: 'unauthorized' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static orderAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield Order_1.Order.findById(req.params.order_id);
            try {
                if (!order) {
                    throw ({ name: 'not_found' });
                }
                else if (req.customer_id != order.customer_id) {
                    throw ({ name: 'unauthorized' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static invoiceAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield Invoice_1.Invoice.findById(req.params.invoice_id);
            try {
                if (!invoice) {
                    throw ({ name: 'not_found' });
                }
                else if (req.customer_id != invoice.customer_id) {
                    throw ({ name: 'unauthorized' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
}
exports.default = auth;
