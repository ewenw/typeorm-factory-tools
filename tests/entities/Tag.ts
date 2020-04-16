import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => User, user => user.tags, {
        cascade: true
    })
    @JoinTable()
    users: User[];

    @Column()
    name: string;

}