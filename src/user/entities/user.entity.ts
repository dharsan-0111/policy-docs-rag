import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enum/user.enum.js";

@Entity()
export class User {

    @Column()
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false, unique: true })
    emailId: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: UserRole.USER })
    role: UserRole;
}
