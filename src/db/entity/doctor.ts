import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import { VisitTime } from "./visitTime";
import {Specialization} from "./specialization";

@Entity({ name: "doctor" })
export class Doctor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50, name: "first_name" })
    firstName!: string;

    @Column({ length: 50, name: "last_name" })
    lastName!: string;

    @Column({ length: 50, nullable: true, name: "surname" })
    surname!: string;

    @Column({ name: "specialization_id" })
    specializationId!: number;

    @ManyToOne(() => Specialization)
    @JoinColumn({ name: 'specialization_id', referencedColumnName: "id" })
    specialization!: Promise<Specialization>;

    specializationData?: Specialization

    @OneToMany(() => VisitTime, (visitTime) => visitTime.doctor)
    visitTimes!: Promise<VisitTime[]>;

    freeVisitTimes?: Partial<VisitTime>[]
}