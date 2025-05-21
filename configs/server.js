"use strict"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import apiLimiter from "../src/middlewares/validar-cant-peticiones.js"
import authRoutes from "../src/auth/auth.routes.js"
import hotelRoutes from "../src/hotel/hotel.routes.js"
import roomRoutes from "../src/room/room.routes.js"
import userRoutes from "../src/user/user.routes.js"
import reservationRoutes from "../src/reservation/reservation.routes.js"
import invoiceRoutes from "../src/invoice/invoice.routes.js"
import extraServiceRoutes from "../src/serviceExtra/extraService.routes.js"
import serviceRoutes from "../src/service/service.routes.js"
import eventRoutes from "../src/event/event.routes.js"
import { createDefaultUsers } from "./createDefaultUsers.js"
import { createDefaultServices } from "./createDefaultServices.js"
import { swaggerDocs } from "./swagger.js"; 

const app = express();

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) => {
    app.use("/casaMiaManagement/v1/auth", authRoutes);
    app.use("/casaMiaManagement/v1/user", userRoutes);
    app.use("/casaMiaManagement/v1/hotel", hotelRoutes);
    app.use("/casaMiaManagement/v1/room", roomRoutes);
    app.use("/casaMiaManagement/v1/reservation", reservationRoutes);
    app.use("/casaMiaManagement/v1/invoice", invoiceRoutes);
    app.use("/casaMiaManagement/v1/extraServices", extraServiceRoutes);
    app.use("/casaMiaManagement/v1/services", serviceRoutes);
    app.use("/casaMiaManagement/v1/event", eventRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection()
    } catch (err) {
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initiServer = () => {
    const app = express()
    try {
        middlewares(app)
        conectarDB()
        routes(app)
        createDefaultUsers(),
        createDefaultServices(),
        
        swaggerDocs(app);

        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (err) {
        console.log(`Server init failed: ${err}`)
    }
}