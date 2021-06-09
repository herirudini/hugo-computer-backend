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
const productSchema = new mongoose_1.Schema({
    name: { type: String },
    priceTag: { type: Number },
    image: [{ type: String }],
    stock: { type: Number },
    category: { type: String },
    description: { type: String }
}, { timestamps: true });
const Product = mongoose_1.default.model('Product', productSchema);
exports.Product = Product;
