import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto';
import { PROJECT_ERROR } from './error';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(id: number, data: CreateProjectDto) {
    try {
      const createdProject = this.prisma.projects.create({
        data: {
          ...data,
          ownerUser: id,
          UsersIntegrated: {
            create: {
              userId: id,
            },
          },
        },
      });

      return createdProject;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(PROJECT_ERROR.FAIL_TO_CREATE);
        }

        throw error;
      }
    }
  }
}
