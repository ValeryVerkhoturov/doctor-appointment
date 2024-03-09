import {Request, Response} from "express";
import {AppDataSource, doctorRepository} from "../../../db/dataSource";
import Logger from "../../../logger/logger";
import {VisitTime} from "../../../db/entity/visitTime";
import {Doctor} from "../../../db/entity/doctor";
import {sanitize} from "../../../utils/sanitize";
import {notifier} from "../../../notifier/notifier";
import {AppUser} from "../../../db/entity/appUser";

export type Slot = Pick<VisitTime, "timeStart">

export class DoctorsController {

    private static checkFreeVisitTimeDates(dateFromString?: string, dateToString?: string): {dateFrom?: Date, dateTo?: Date, body?: any, statusCode?: number} {
        if (!dateFromString || !dateToString) {
            return {body: {message: 'Date from and date to are required.'}, statusCode: 400};
        }
        let dateFrom: Date;
        let dateTo: Date;
        try {
            dateFrom = new Date(dateFromString as string);
            dateTo = new Date(dateToString as string);
        } catch (error) {
            Logger.error('Error parsing date: ', error);
            return {body: {message: 'Invalid date format.'}, statusCode: 400};
        }
        if (dateFrom > dateTo) {
            return {body: {message: 'Date from must be before date to.'}, statusCode: 400};
        }
        return {dateFrom, dateTo};
    }

    private static generateAllSlots(dateFrom: Date, dateTo: Date): Slot[] {
        const startHour = 10;
        const endHour = 20;
        const slotDuration = 30; // в минутах
        let slots: Slot[] = [];

        let currentDate = new Date(dateFrom);

        while (currentDate <= dateTo) {
            for (let hour = startHour; hour < endHour; hour++) {
                for (let minute = 0; minute < 60; minute += slotDuration) {
                    let slot = new Date(currentDate);
                    slot.setHours(hour, minute, 0, 0);
                    slots.push({timeStart: slot});
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return slots;
    }

    public static filterOutOccupiedSlots(allSlots: Slot[], occupiedSlots: Slot[]) {
        const format = (date: Date) => date.toISOString();
        const occupied = new Set(occupiedSlots.map((slot) => format(slot.timeStart)));
        return allSlots.filter((slot) => !occupied.has(format(slot.timeStart)));
    }

    public static async getAll(req: Request, res: Response) {
        const dateFromString = req.query.dateFrom;
        const dateToString = req.query.dateTo;

        let {dateFrom, dateTo, body, statusCode} =
            DoctorsController.checkFreeVisitTimeDates(dateFromString as string, dateToString as string);
        if (body || !dateFrom || !dateTo) {
            return res.status(statusCode ?? 500).send(body);
        }

        const doctors = await doctorRepository.find().then(async doctors => {
            for (const doctor of doctors) {
                const allSlots = DoctorsController.generateAllSlots(dateFrom, dateTo);
                const doctorOccupiedSlots = await doctor.visitTimes;

                doctor.freeVisitTimes = DoctorsController.filterOutOccupiedSlots(allSlots, doctorOccupiedSlots);
            }
            return sanitize(doctors);
        });

        return res.status(200).send({
            doctors
        })
    }

    private static checkAppointmentTime(timeStartString?: string, doctorId?: string): {timeStart?: Date, timeEnd?: Date, doctorId?: number, body?: any, statusCode?: number} {
        if (!timeStartString) {
            return {body: {message: 'Time start is required.'}, statusCode: 400};
        }

        const parsedDoctorId = Number(doctorId);

        if (!doctorId || !parsedDoctorId) {
            return {body: {message: 'Doctor id is required.'}, statusCode: 400};
        }

        let timeStart: Date;
        let timeEnd: Date;
        try {
            timeStart = new Date(timeStartString as string);
            timeEnd = new Date(timeStart.getTime() + 30 * 60 * 1000);
        } catch (error) {
            Logger.error('Error parsing date: ', error);
            return {body: {message: 'Invalid date format.'}, statusCode: 400};
        }

        if (new Date() > timeStart) {
            return {body: {message: 'It is forbidden to make an appointment in the past.'}, statusCode: 400};
        }

        const now = new Date(timeStart.getTime());
        now.setHours(0, 0, 0, 0)
        if (!DoctorsController.generateAllSlots(now, now).some(slot => slot.timeStart.getTime() === timeStart.getTime())) {
            return {body: {message: 'Forbidden time slot.'}, statusCode: 400};
        }
        return {timeStart, timeEnd, doctorId: parsedDoctorId};
    }

    public static async makeAppointment(req: Request, res: Response) {
        const timeStartString = req.body.timeStart;
        const doctorIdString = req.body.doctorId;

        let {timeStart, timeEnd, doctorId, body, statusCode} =
            DoctorsController.checkAppointmentTime(timeStartString as string, doctorIdString as string);
        if (body || !timeStart || !timeEnd || !doctorId) {
            return res.status(statusCode ?? 500).send(body);
        }

        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                const appUserRepo = transactionalEntityManager.getRepository(AppUser);
                const doctorRepo = transactionalEntityManager.getRepository(Doctor);
                const visitTimeRepo = transactionalEntityManager.getRepository(VisitTime);

                const user = await appUserRepo.findOneBy({ id: req.userId });
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                const doctor = await doctorRepo.findOneBy({ id: doctorId });
                if (!doctor) {
                    return res.status(404).json({ message: 'Doctor not found.' });
                }
                doctor.specializationData = await doctor.specialization

                const overlappingVisits = await visitTimeRepo.createQueryBuilder("visit_time")
                    .where("visit_time.doctor_id = :doctorId", { doctorId })
                    .andWhere(":timeStart < visit_time.time_end AND :timeStart >= visit_time.time_start", {
                        timeStart,
                    })
                    .getCount();

                if (overlappingVisits > 0) {
                    return res.status(400).json({ message: 'This time slot is already booked.' });
                }

                const visitTime = new VisitTime();
                visitTime.appUserId = req.userId;
                visitTime.doctorId = doctorId;
                visitTime.timeStart = timeStart;
                visitTime.timeEnd = timeEnd;

                await visitTimeRepo.save(visitTime);
                await notifier.scheduleMessage(user.phone, user.username, doctor.firstName, doctor.lastName, doctor.specializationData.specName, timeStart);

                return res.json({ message: 'Visit time successfully added.', visitTime });
            });
        } catch (error) {
            Logger.error("makeAppointment transaction error:", error);
            return res.status(400).json({ message: 'Error adding visit time.' });
        }
    }
}