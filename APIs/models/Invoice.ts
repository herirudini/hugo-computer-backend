import mongoose, { Schema } from 'mongoose';

interface Invoice {
    status: string,
    user_id: string,
    orders: object[]
    bills: string,
    paymentMethod: string,
    shippingMethod: string,
    transferCode: string,
    address: object,
}

interface InvoiceData extends mongoose.Document {
    status: string, //unpaid - cancel - paid - shipping - arrived - trouble
    user_id: string,
    orders: object[]
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
    status: {type: String, default: "unpaid"},
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    bills: { type: String },
    transferCode: { type: String },
    paymentMethod: { type: String, required: true },
    shippingMethod: { type: String },
    address: {type: Object},
    orders: [{ type: Object }]
}, { timestamps: true });

const Invoice = mongoose.model<InvoiceData, InvoiceModelInterface>('Invoice', invoiceSchema)
export { Invoice }