"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../models/Message");
class messageController {
    static createMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user_id;
            const newText = req.body.send_text;
            let newMessage;
            try {
                newMessage = yield Message_1.Message.create({
                    user_id: user_id,
                    contents: newText
                });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(201).json({ success: true, message: "Message sent", data: newMessage });
            }
        });
    }
    static listMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let messageList;
            try {
                messageList = yield Message_1.Message.find({ user_id: req.user_id });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Your messages list", data: messageList });
            }
        });
    }
    static checkMessageById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let retriveMessage;
            try {
                retriveMessage = yield Message_1.Message.findOne({ id: req.params.message_id });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Your message", data: retriveMessage });
            }
        });
    }
    static pushMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newText = req.body.send_text;
            let pushText;
            try {
                pushText = yield Message_1.Message.findOneAndUpdate({ id: req.params.message_id }, { $push: { text: newText } }, { new: true });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Message sent", data: pushText });
            }
        });
    }
}
exports.default = messageController;
