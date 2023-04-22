import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
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

  async resetPassword(token: string, password: string) {
    const data = this.jwtService.decode(token);

    const hashPassword = await hash(password, 10);

    await this.prismaService.users.update({
      where: {
        id: data.sub,
      },
      data: {
        password: hashPassword,
      },
    });
  }
}
