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
const invoiceSchema = new mongoose_1.Schema({
    customer_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    bills: { type: String },
    transferCode: { type: String },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "unpaid" },
    shippingMethod: { type: String },
    shippingStatus: { type: String, default: "standby" },
    address: { type: Object },
    orderList: [{ type: Object }]
}, { timestamps: true });
const Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
exports.Invoice = Invoice;
