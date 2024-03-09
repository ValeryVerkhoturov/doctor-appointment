import {Request, Response} from "express";
import {visitTimeRepository} from "../../../db/dataSource";
import {sanitize} from "../../../utils/sanitize";

export class VisitTimeController {

    public static async getAll(req: Request, res: Response) {
        return res.status(200).send(
            await visitTimeRepository.find({where: {appUserId: req.userId}}).then(async visitTimes => {
                for (const visitTime of visitTimes) {
                    visitTime.doctorData = await visitTime.doctor
                    if (visitTime.doctorData) {
                        visitTime.doctorData.specializationData = await visitTime.doctorData.specialization
                    }
                }
                return sanitize(visitTimes)
            })

        )
    }
}