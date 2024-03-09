import { DataSource } from "typeorm";
import { AppUser } from "./entity/appUser";
import { Doctor } from "./entity/doctor";
import { Specialization } from "./entity/specialization";
import { VisitTime } from "./entity/visitTime";
import {env} from "../env";
import Logger from "../logger/logger";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.dbHost,
    port: env.dbPort,
    username: env.dbUsername,
    password: env.dbPassword,
    database: env.dbName,
    synchronize: true,
    logging: false,
    entities: [AppUser, Doctor, Specialization, VisitTime],
    migrations: [],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        Logger.info("Data Source has been initialized!");
    })
    .catch((err) => {
        Logger.error("Error during Data Source initialization:", err);
    });

export const appUserRepository = AppDataSource.getRepository(AppUser);
export const doctorRepository = AppDataSource.getRepository(Doctor);
export const specializationRepository = AppDataSource.getRepository(Specialization);
export const visitTimeRepository = AppDataSource.getRepository(VisitTime)