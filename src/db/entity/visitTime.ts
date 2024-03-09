import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn} from "typeorm";
import { AppUser } from "./appUser";
import { Doctor } from "./doctor";

@Entity({ name: "visit_time" })
export class VisitTime extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "doctor_id" })
    doctorId!: number;

    @Column({ name: "app_user_id" })
    appUserId!: number;

    @Column("timestamp", { name: "time_start" })
    timeStart!: Date;

    @Column("timestamp", { name: "time_end" })
    timeEnd!: Date;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: 'doctor_id', referencedColumnName: "id" })
    doctor!: Promise<Doctor>;

    doctorData?: Doctor

    @ManyToOne(() => AppUser)
    @JoinColumn({ name: 'app_user_id', referencedColumnName: "id" })
    appUser!: Promise<AppUser>;

    appUserData?: AppUser;
}