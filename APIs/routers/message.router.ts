import { Router } from 'express'
import messageController from '../controllers/message.controller'

class messageRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createMessage()
        this.listMessages()
        this.checkMessageById()
        this.pushMessage()
    }
    public createMessage(): void {
        this.router.post('/messages', messageController.createMessage)
    }
    public listMessages(): void {
        this.router.get('/messages', messageController.listMessages);
    }
    public checkMessageById(): void {
        this.router.get('/messages/:message_id', messageController.checkMessageById)
    }
    public pushMessage(): void {
        this.router.put('/messages/:message_id', messageController.pushMessage);
    }
}
//FOTER//

export default new messageRouter().router