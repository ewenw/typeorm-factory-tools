import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Photo } from "./Photo";
import { Tag } from "./Tag";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];

    @ManyToMany(type => Tag, tag => tag.users)
    tags: Tag[];

}