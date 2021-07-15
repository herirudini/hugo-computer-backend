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
        this.historyInvoices()
    }
    public listInvoices(): void {
        this.router.get('/invoices/on-process', invoiceController.listInvoices);
    }
    public invoiceDetails(): void {
        this.router.get('/invoices/on-process/:invoice_id', auth.invoiceAuthor, invoiceController.invoiceDetails);
    }
    public confirmPayment(): void {
        this.router.put('/invoices/on-process/:invoice_id', auth.invoiceAuthor, invoiceController.confirmPayment);
    }
    public confirmShipment(): void {
        this.router.patch('/invoices/on-process/:invoice_id', auth.invoiceAuthor, invoiceController.confirmShipment);
    }
    public historyInvoices(): void {
        this.router.get('/invoices/history', invoiceController.purchasementHistory);
    }
}

export default new invoiceRouter().router
