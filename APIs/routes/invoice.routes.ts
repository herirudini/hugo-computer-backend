import { Router } from 'express'
// import IRoutes from './IRoutes'
import invoiceController from '../controllers/invoice.controller'
import auth from '../middlewares/authJwt'

class invoiceRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.listInvoices()
        this.invoiceDetails()
        this.confirmPayment()
        this.confirmShipment()
    }
    public listInvoices(): void {
        this.router.get('/invoices', invoiceController.listInvoices);
    }
    public invoiceDetails(): void {
        this.router.get('/invoices/:invoice_id', auth.invoiceAuthor, invoiceController.invoiceDetails);
    }
    public confirmPayment(): void {
        this.router.put('/invoices/:invoice_id', auth.invoiceAuthor, invoiceController.confirmPayment);
    }
    public confirmShipment(): void {
        this.router.patch('/invoices/:invoice_id', auth.invoiceAuthor, invoiceController.confirmShipment);
    }
}

export default new invoiceRouter().router
