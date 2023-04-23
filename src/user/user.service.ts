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

  async integrateMember(token: string) {
    const data = this.jwtService.decode(token) as {
      sub: number;
      email: string;
    };

    if (!data) {
      return 'Convite expirado! :(';
    }

    const user = await this.prismaService.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return 'Usuário não encontrado! :(';
    }

    try {
      const integrateExist = this.prismaService.userProjects.findFirst({
        where: {
          userId: user.id,
          projectId: data.sub,
        },
      });

      if (integrateExist) {
        return 'Você já faz parte desse projeto!';
      }

      await this.prismaService.userProjects.create({
        data: {
          projectId: data.sub,
          userId: user.id,
        },
      });
      return 'Parabéns, você foi integrado ao projeto!';
    } catch (err) {
      return 'Falha no processo de integração no projeto, por favor tente mais tarde!';
    }
  }
}
