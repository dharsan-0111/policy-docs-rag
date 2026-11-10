import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { UserRole } from "../enum/user.enum.js";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    emailId: string;

    @IsNotEmpty()
    password: string;

    role: UserRole;
}