import { Message } from '../models/Message'
import { Request, Response, NextFunction } from 'express'

class messageController {
    static async createMessage(req: Request, res: Response, next: NextFunction) {
        const user_id: any = (<any>req).user_id
        const newText = req.body.send_text
        let newMessage: any;

        try {
            newMessage = await Message.create({
                user_id: user_id,
                contents: newText
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Message sent", data: newMessage })
        }
    }
    static async listMessages(req: Request, res: Response, next: NextFunction) {
        let messageList;

        try {
            messageList = await Message.find({ user_id: (<any>req).user_id })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Your messages list", data: messageList })
        }
    }
    static async checkMessageById(req: Request, res: Response, next: NextFunction) {
        let retriveMessage;

        try {
            retriveMessage = await Message.findOne({ id: req.params.message_id })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Your message", data: retriveMessage })
        }
    }
    static async pushMessage(req: Request, res: Response, next: NextFunction) {
        const newText: any = req.body.send_text
        let pushText;

        try {
            pushText = await Message.findOneAndUpdate({ id: req.params.message_id }, { $push: { text: newText } }, { new: true })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Message sent", data: pushText })
        }
    }
}

export default messageController