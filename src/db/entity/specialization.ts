import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity({ name: "specialization" })
export class Specialization extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255, unique: true, name: "spec_name" })
    specName!: string;
}