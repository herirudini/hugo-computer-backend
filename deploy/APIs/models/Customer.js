"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator = require('mongoose-validators');
const customerSchema = new mongoose_1.Schema({
    phone: { type: String, validate: validator.isNumeric(), required: true },
    email: {
        type: String,
        validate: validator.isEmail(),
        required: true
    },
    password: {
        type: String,
        required: true, select: false
    },
    name: { type: String, required: true },
    address: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Address' }],
    invoices: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice' }],
    wishlist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }],
    logIp: [{ type: String }],
    logToken: { type: String }
}, { timestamps: true });
const Customer = mongoose_1.default.model('Customer', customerSchema);
exports.Customer = Customer;
