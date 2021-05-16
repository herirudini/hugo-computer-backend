import { Router } from 'express'
import addressController from '../controllers/address.controller'

class addressRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.listAddress()
        this.createAddress()
        this.checkAddress()
        this.editAddress()
        this.deleteAddress()
    }
    public listAddress(): void {
        this.router.get('/address', addressController.listAddress);
    }
    public createAddress(): void {
        this.router.post('/address', addressController.createAddress, addressController.listAddress);
    }
    public checkAddress(): void {
        this.router.get('/address/:address_id', addressController.checkAddress);
    }
    public editAddress(): void {
        this.router.patch('/address/:address_id', addressController.setDefaultAddress);
    }
    public deleteAddress(): void {
        this.router.delete('/address/:address_id', addressController.deleteAddress, addressController.listAddress);
    }
}

export default new addressRouter().router
