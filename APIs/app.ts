import { Application } from 'express'
import express from 'express'
import routers from './routers/router'
import connectDB from '../config/connect-database'
import dotenv from 'dotenv'
import cors from 'cors'

class App {
   public app: Application
   constructor() {
      dotenv.config()
      this.app = express()
      this.plugin()
      this.cors()
      this.routers()
   }

   protected plugin(): void {
      this.app.use(express.urlencoded({ extended: true }))
      this.app.use(express.json());
      connectDB();
   }
   protected cors(): void {
      this.app.use(cors())
      this.app.use((req, res, next) => {
         res.setHeader("Access-Control-Allow-Origin", "*");
         res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
         );
         res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS"
         );
         next();
      });
   }
   protected routers(): void {
      this.app.use(routers)
   }
}
const app = new App().app
const port: any = process.env.PORT
app.listen(port, () => { console.log(`listening to http://localhost:${port}/`) })