import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Body, Put } from '@nestjs/common/decorators';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  getUser(@GetUser() user: Users) {
    return user;
  }

  @Put('')
  @HttpCode(HttpStatus.OK)
  update(@GetUser('id') id: number, @Body() data: EditUserDto) {
    return this.userService.update(id, data);
  }
}
