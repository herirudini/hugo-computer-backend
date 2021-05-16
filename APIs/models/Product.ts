import mongoose, { Schema } from 'mongoose';

interface Product {
    name: string,
    priceTag: number,
    image: string[],
    stock: number,
    category: string,
    description: string
}

interface ProductData extends mongoose.Document {
    name: string,
    priceTag: number,
    image: string[],
    stock: number,
    category: string,
    description: string
}

interface ProductModelInterface extends mongoose.Model<ProductData> {
    build(attr: Product): ProductData
}

const productSchema = new Schema({
    name: { type: String },
    priceTag: { type: Number },
    image: [{ type: String }],
    stock: { type: Number },
    category: { type: String },
    description: { type: String }
}, { timestamps: true });

const Product = mongoose.model<ProductData, ProductModelInterface>('Product', productSchema)
export { Product }