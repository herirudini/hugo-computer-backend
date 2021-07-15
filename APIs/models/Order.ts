import mongoose, { Schema } from 'mongoose';

interface Order {
    status: string
    user_id: string,
    product_id: string,
    productName: string,
    productImage: string[],
    quantity: number,
    notes: string,
    priceTag: number,
    totalPrice: number
}

interface OrderData extends mongoose.Document {
    status: string //on-process - cancel - passed
    user_id: string,
    product_id: string,
    productName: string,
    productImage: string[],
    quantity: number,
    notes: string,
    priceTag: number,
    totalPrice: number
}

interface OrderModelInterface extends mongoose.Model<OrderData> {
    build(attr: Order): OrderData
}

const orderSchema = new Schema({
    status: {type: String, default: "on-process"},
    user_id: { type: Schema.Types.ObjectId, required: true },
    product_id: {type: String},
    productName: {type: String},
    productImage: [{type: String}],
    quantity: {type: Number, required: true},
    notes: {type: String},
    priceTag: {type: Number},
    totalPrice: {type: Number}
},{timestamps: true});

const Order = mongoose.model<OrderData, OrderModelInterface>('Order', orderSchema)
export { Order }
