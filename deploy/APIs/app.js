"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const connect_database_1 = __importDefault(require("../config/connect-database"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
class App {
    constructor() {
        dotenv_1.default.config();
        this.app = express_1.default();
        this.plugin();
        this.cors();
        this.routes();
    }
    plugin() {
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        connect_database_1.default();
    }
    cors() {
        this.app.use(cors_1.default());
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            next();
        });
    }
    routes() {
        this.app.use(routes_1.default);
    }
}
const app = new App().app;
const port = process.env.PORT;
app.listen(port, () => { console.log(`listening to http://localhost:${port}/`); });
