import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private repo: Repository<User>
    ) {}

    async createUser(userInfo: CreateUserDto) {
        await this.repo.save(this.repo.create(userInfo))
        return 'Signup successful'
    }

    async getAllUsers() {
        return await this.repo.find()
    }

    async getUser(emailId: string) {
        return await this.repo.findOneBy({ emailId })
    }
}
