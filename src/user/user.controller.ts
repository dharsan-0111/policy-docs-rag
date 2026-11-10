import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { AuthGuard } from '../authentication/auth.guard.js';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { readdir, readFile } from 'node:fs/promises';
import * as path from 'path';
import { makeChunks } from '../utils/util.service.js';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Req() request: Request) {
    // const token = request?.cookies['jwt']
    // const decoded = this.jwtService.decode(token) 
    // console.log(decoded, 'decoded token')
    
  }
}
