import { Request, Response } from "express";
import {AppDataSource, appUserRepository} from "../../../db/dataSource";
import Logger from "../../../logger/logger";
import jsonwebtoken from "jsonwebtoken";
import {AppUser} from "../../../db/entity/appUser";
import {env} from "../../../env";

export class UsersController {

    public static async sendCode(req: Request, res: Response) {
        const { phone, username } = req.body;
        if (!phone) {
            return res.status(400).send({ message: 'Phone is required.' });
        }

        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                let user = await transactionalEntityManager.findOne(AppUser, { where: { phone } });

                if (!user) {
                    user = transactionalEntityManager.create(AppUser, {username, phone});
                    await transactionalEntityManager.save(user);
                }

                console.log("***Отправка кода 0000***")

                res.status(200).send({
                    message: 'Code sent successfully.',
                });
            });
        } catch (error) {
            Logger.error('Error sending code: ', error);
            res.status(500).send({ message: 'Error sending code.' });
        }
    }

    public static async verifyCode(req: Request, res: Response) {
        const { phone, code } = req.body;

        if (!phone || !code) {
            return res.status(400).json({ error: 'Phone number and code are required' });
        }

        if (code !== '0000') {
            return res.status(400).json({ error: 'Invalid code' });
        }

        const user = await appUserRepository.findOne({ where: { phone } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const token = jsonwebtoken.sign({ id: user.id }, env.jwtSecret, { expiresIn: '1y' });

        res.status(200).json({ message: 'User verified successfully', user, token });
    }
}