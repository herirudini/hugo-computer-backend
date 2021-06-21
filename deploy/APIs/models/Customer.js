"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator = require('mongoose-validators');
const userSchema = new mongoose_1.Schema({
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
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
