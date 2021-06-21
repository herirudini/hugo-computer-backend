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
const orderSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    product_id: { type: String },
    productName: { type: String },
    productImage: [{ type: String }],
    quantity: { type: Number, required: true },
    notes: { type: String },
    priceTag: { type: Number },
    totalPrice: { type: Number }
}, { timestamps: true });
const Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
