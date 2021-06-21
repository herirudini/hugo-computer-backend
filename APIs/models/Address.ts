import mongoose, { Schema } from 'mongoose';

interface Address {
    user_id: string,
    status: string,
    country: string,
    state: string,
    city: string,
    zip: string,
    street: string,
    details: string
}

interface AddressData extends mongoose.Document {
    user_id: string,
    status: string,
    country: string,
    state: string,
    city: string,
    zip: string,
    street: string,
    details: string
}

interface AddressModelInterface extends mongoose.Model<AddressData> {
    build(attr: Address): AddressData
}

const addressSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    street: { type: String, required: true },
    details: { type: String, required: true }
}, { timestamps: true });

const Address = mongoose.model<AddressData, AddressModelInterface>('Address', addressSchema)
export { Address }