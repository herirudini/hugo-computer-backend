import mongoose from 'mongoose'
// const secretKey: string = (process.env.DATABASE as string)
class mongoDB {
    public connectDB(): void {
        const db = mongoose.connection
        const path: any = process.env.DATABASE as string
        const connectOption = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        }
        mongoose.set('runValidators', true)
        mongoose.connect(path, connectOption)


        db.on('error', console.error.bind(console, "Database connection error: "))
        db.once('open', () => {
            console.log("Database connected..")
        })
    }
}

export default new mongoDB().connectDB