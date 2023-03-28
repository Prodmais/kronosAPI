import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email
      }
    });

    return user;
  }

  async update(id: number, data: EditUserDto) {
    const user = await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    delete user.password;

    return user;
  }
}
