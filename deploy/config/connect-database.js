"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const secretKey: string = (process.env.DATABASE as string)
class mongoDB {
    connectDB() {
        const db = mongoose_1.default.connection;
        const path = process.env.DATABASE;
        const connectOption = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };
        mongoose_1.default.set('runValidators', true);
        mongoose_1.default.connect(path, connectOption);
        db.on('error', console.error.bind(console, "Database connection error: "));
        db.once('open', () => {
            console.log("Database connected..");
        });
    }
}
exports.default = new mongoDB().connectDB;
