import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from "typeorm";
import { VisitTime } from "./visitTime";

@Entity({ name: "app_user" })
export class AppUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 256, name: "username" })
    username!: string;

    @Column({ length: 11, unique: true, name: "phone" })
    phone!: string;

    @OneToMany(() => VisitTime, (visitTime) => visitTime.appUser)
    visitTimes!: Promise<VisitTime[]>;
}