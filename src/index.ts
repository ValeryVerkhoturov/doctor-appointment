import "reflect-metadata";
import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import {UsersController} from "./controllers/api/v1/users";
import {env} from "./env";
import Logger from "./logger/logger";
import {DoctorsController} from "./controllers/api/v1/doctors";
import {authenticateToken} from "./utils/authMiddleware";
import {VisitTimeController} from "./controllers/api/v1/visitTime";
import {errorHandlerMiddleware} from "./utils/errorHandlerMiddleware";
import {notifier} from "./notifier/notifier";

dotenv.config();

notifier.connect();

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json())
app.use(authenticateToken);
app.use(errorHandlerMiddleware)

app.post("/api/v1/users/sendCode", UsersController.sendCode)
app.post("/api/v1/users/verifyCode", UsersController.verifyCode)

app.get("/api/v1/doctors/all", DoctorsController.getAll)
app.post("/api/v1/doctors/makeAppointment", DoctorsController.makeAppointment)

app.get("/api/v1/visitTime/all", VisitTimeController.getAll)

app.listen(env.port, () => {
    Logger.info(`[server]: Server is running at http://localhost:${env.port}`)
});