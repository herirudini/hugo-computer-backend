import mongoose, { Schema } from 'mongoose';

interface Invoice {
    user_id: string,
    orderList: object[]
    paymentStatus: string,
    shippingStatus: string,
    bills: string,
    paymentMethod: string,
    shippingMethod: string,
    transferCode: string,
    address: object,
}

interface InvoiceData extends mongoose.Document {
    user_id: string,
    orderList: object[]
    paymentStatus: string,
    shippingStatus: string,
    bills: string,
    paymentMethod: string,
    shippingMethod: string,
    transferCode: string,
    address: object,
}

interface InvoiceModelInterface extends mongoose.Model<InvoiceData> {
    build(attr: Invoice): InvoiceData
}
const invoiceSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    bills: { type: String },
    transferCode: { type: String },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "unpaid" },
    shippingMethod: { type: String },
    shippingStatus: { type: String, default: "standby" },
    address: {type: Object},
    orderList: [{ type: Object }]
}, { timestamps: true });

const Invoice = mongoose.model<InvoiceData, InvoiceModelInterface>('Invoice', invoiceSchema)
export { Invoice }