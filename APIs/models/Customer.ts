import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Customer {
    phone: string,
    email: string,
    password: string,
    name: string,
    address: string[],
    invoices: string[],
    wishlist: string[],
    logIp: any[],
    logToken: string
}

interface CustomerData extends mongoose.Document {
    phone: string,
    email: string,
    password: string,
    name: string,
    address: string[],
    invoices: string[],
    wishlist: string[],
    logIp: any[],
    logToken: string
}

interface CustomerModelInterface extends mongoose.Model<CustomerData> {
    build(attr: Customer): CustomerData
}

const customerSchema = new Schema({
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
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    logIp: [{ type: String }],
    logToken: { type: String }
}, { timestamps: true });

const Customer = mongoose.model<CustomerData, CustomerModelInterface>('Customer', customerSchema)
export { Customer }