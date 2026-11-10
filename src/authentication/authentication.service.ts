import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { SignupDto } from './dto/signup.dto.js';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/enum/user.enum.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    async signup(signupInfo: SignupDto) {

        const userEmail = await this.userService.getUser(signupInfo.emailId);
        if(userEmail) {
            throw new ConflictException('A user with the same email already exists')
        }

        const password = signupInfo.password;

        const hashedPwd = await bcrypt.hash(password, 10)

        await this.userService.createUser({
            emailId: signupInfo.emailId,
            password: hashedPwd,
            role: UserRole.USER
        })

        return 'Signup successful and Data stored in db'
    }

    async login(loginInfo: LoginDto) {
        const userEmail = loginInfo.emailId;
        const isUserPresent = await this.userService.getUser(userEmail);
        if(!isUserPresent) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const validUser = await bcrypt.compare(loginInfo.password, isUserPresent.password)
        if(!validUser) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const tokenPayload = {
            id: isUserPresent.id,
            emailId: isUserPresent.emailId,
            role: isUserPresent.role
        }

        const token = await this.jwtService.signAsync(tokenPayload);
        return { token }
    }

}
