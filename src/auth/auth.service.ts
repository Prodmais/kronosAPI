import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { SigninDto, SignupDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { compare, hash } from 'bcrypt';
import { AUTH_ERROR } from '../error';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const userExist = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExist) {
      throw new BadRequestException(AUTH_ERROR.USER_EXISTS);
    }

    const hashPassword = await hash(data.password, 10);

    try {
      const user = await this.prisma.users.create({
        data: {
          ...data,
          password: hashPassword,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(AUTH_ERROR.FAIL_TO_CREATE);
        }

        throw error;
      }
    }
  }

  async signin(data: SigninDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) throw new ForbiddenException(AUTH_ERROR.UNAUTHORIZED);

    const isMatch = await compare(data.password, user.password);

    if (!isMatch) throw new ForbiddenException(AUTH_ERROR.UNAUTHORIZED);

    return this.signToken(user.id, user.email);
  }

  async signToken(id: number, email: string): Promise<{ token: string }> {
    const payload = {
      sub: id,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret,
    });

    return {
      token: token,
    };
  }
}
