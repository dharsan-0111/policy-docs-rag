import { IsEmail, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto.js";

export class SignupDto {
    @IsNotEmpty()
    @IsEmail()
    emailId: string;

    @IsNotEmpty()
    // @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 2, minUppercase: 1, minSymbols: 1 })
    password: string;
}