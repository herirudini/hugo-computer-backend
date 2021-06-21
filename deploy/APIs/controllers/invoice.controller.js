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
const Invoice_1 = require("../models/Invoice");
const User_1 = require("../models/User");
class invoiceController {
    static listInvoices(req, res, next) {
        Invoice_1.Invoice.find({ user_id: req.user_id, shippingStatus: { $in: ["on process", "trouble", "standby"] } })
            .then((result) => {
            if (result == null) {
                throw ({ name: 'not_found' });
            }
            res.status(200).json({ success: true, message: "Invoices:", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static invoiceDetails(req, res, next) {
        Invoice_1.Invoice.findById(req.params.invoice_id)
            .then((result) => {
            res.status(200).json({ success: true, message: "Invoice details:", data: result });
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
    static confirmPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield Invoice_1.Invoice.findById(req.params.invoice_id);
            const insertCode = req.body.insert_code;
            let updateStatus;
            let pushInvoiceId;
            try {
                if (insertCode == "123" && invoice.paymentStatus == "unpaid") {
                    updateStatus = yield Invoice_1.Invoice.findByIdAndUpdate(req.params.invoice_id, { paymentStatus: "paid-off", shippingStatus: "on process" }, { new: true });
                    pushInvoiceId = yield User_1.User.findByIdAndUpdate(req.user_id, { $push: { invoices: req.params.invoice_id } }, { new: true });
                }
                else {
                    res.status(500).json({ success: false, message: "Wrong code" });
                }
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(201).json({ success: true, message: "Invoice updated", data: updateStatus });
            }
        });
    }
    static confirmShipment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield Invoice_1.Invoice.findById(req.params.invoice_id);
            const checkStatus = invoice.shippingStatus;
            const confirmation = req.body.confirm_shipment;
            let shippingStatus;
            let updateShipping;
            try {
                if (confirmation == "arrived")
                    shippingStatus = "arrived";
                else if (confirmation == "not arrived" && checkStatus == "on process")
                    shippingStatus = "trouble";
                else
                    shippingStatus = checkStatus;
                updateShipping = yield Invoice_1.Invoice.findByIdAndUpdate(req.params.invoice_id, { shippingStatus: shippingStatus }, { new: true });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(201).json({ success: true, message: "Invoice updated", data: updateShipping });
            }
        });
    }
    static historyInvoices(req, res, next) {
        Invoice_1.Invoice.find({ user_id: req.user_id, shippingStatus: "arrived" })
            .then((result) => {
            if (result == null) {
                throw ({ name: 'not_found' });
            }
            res.status(200).json({ success: true, message: "Purchasement history:", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
}
exports.default = invoiceController;
