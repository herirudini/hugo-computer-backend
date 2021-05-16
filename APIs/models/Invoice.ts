import mongoose, { Schema } from 'mongoose';

interface Invoice {
    customer_id: string,
    bills: string,
    paymentMethod: string,
    transferCode: string,
    paid: string,
    shippingMethod: string,
    arrived: string,
    address: object,
    orderList: object[]
}

interface InvoiceData extends mongoose.Document {
    customer_id: string,
    bills: string,
    paymentMethod: string,
    transferCode: string,
    paid: string,
    shippingMethod: string,
    arrived: string,
    address: object,
    orderList: object[]
}

interface InvoiceModelInterface extends mongoose.Model<InvoiceData> {
    build(attr: Invoice): InvoiceData
}
const invoiceSchema = new Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, required: true },
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