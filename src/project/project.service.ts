import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, EditProjectDto } from './dto';
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

  async findOne(userId: number, id: number) {
    const projectExist = await this.prisma.projects.findFirst({
      where: {
        id: id,
        UsersIntegrated: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            email: true,
            password: false,
          },
        },
        UsersIntegrated: {
          include: {
            Users: {
              select: {
                id: true,
                name: true,
                email: true,
                password: false,
              },
            },
          },
        },
      },
    });

    if (!projectExist) {
      throw new NotFoundException(PROJECT_ERROR.NOT_FOUND);
    }

    return projectExist;
  }

  async update(userId: number, id: number, data: EditProjectDto) {
    await this.findOne(userId, id);

    const editedProject = await this.prisma.projects.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });

    return editedProject;
  }

  findAll(userId: number) {
    return this.prisma.projects.findMany({
      where: {
        UsersIntegrated: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }
}
