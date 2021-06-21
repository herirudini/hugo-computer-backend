import mongoose, { Schema } from 'mongoose';

interface Message {
    user_id: string,
    text: string[],
}

interface MessageData extends mongoose.Document {
    user_id: string,
    text: string[],
}

interface MessageModelInterface extends mongoose.Model<MessageData> {
    build(attr: Message): MessageData
}

const messageSchema = new Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    text: [{type: String}],
    // from: {type: String}, //sender_id = user_id/admin_id
    // to: {type: String} //receiver_id = user_id/admin_id
},{timestamps: true});

const Message = mongoose.model<MessageData, MessageModelInterface>('Message', messageSchema)
export { Message }