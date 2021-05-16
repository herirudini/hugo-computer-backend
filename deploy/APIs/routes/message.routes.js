"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
class messageRouter {
    constructor() {
        this.router = express_1.Router();
        this.createMessage();
        this.listMessages();
        this.checkMessageById();
        this.pushMessage();
    }
    createMessage() {
        this.router.post('/messages', message_controller_1.default.createMessage);
    }
    listMessages() {
        this.router.get('/messages', message_controller_1.default.listMessages);
    }
    checkMessageById() {
        this.router.get('/messages/:message_id', message_controller_1.default.checkMessageById);
    }
    pushMessage() {
        this.router.put('/messages/:message_id', message_controller_1.default.pushMessage);
    }
}
//FOTER//
exports.default = new messageRouter().router;
