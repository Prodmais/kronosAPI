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

    if (!data) {
      return 'NOT FOUND, 404!';
    }

    try {
      const hashPassword = await hash(password, 10);

      await this.prismaService.users.update({
        where: {
          id: data.sub,
        },
        data: {
          password: hashPassword,
        },
      });

      return 'Senha resetada com sucesso!';
    } catch (err) {
      return 'Falha ao resetar a senha, por favor tente mais tarde!';
    }
  }
}
