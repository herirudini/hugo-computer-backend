import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface User {
    isAdmin: boolean,
    phone: string,
    email: string,
    password: string,
    name: string,
    address: string[],
    wishlist: string[],
    logIp: any[]
}

interface UserData extends mongoose.Document {
    isAdmin: boolean,
    phone: string,
    email: string,
    password: string,
    name: string,
    address: string[],
    wishlist: string[],
    logIp: any[]
}

interface UserModelInterface extends mongoose.Model<UserData> {
    build(attr: User): UserData
}

const userSchema = new Schema({
    isAdmin: { type: Boolean, default: false, select: false },
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
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    logIp: [{ type: String }]
}, { timestamps: true });

const User = mongoose.model<UserData, UserModelInterface>('User', userSchema)
export { User }