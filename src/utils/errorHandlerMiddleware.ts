import Logger from "../logger/logger";
import {Errback, Request, Response, NextFunction} from "express"


export function errorHandlerMiddleware (err: Errback, req: Request, res: Response, next: NextFunction) {
    Logger.error(err)
    res.status(500).send({ error: "Something went wrong" })
}