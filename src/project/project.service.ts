import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, EditProjectDto, InviteProjectDto } from './dto';
import { PROJECT_ERROR } from '../error';
import { InviteEmailService } from 'src/mail/services/invite-email.service';

const DEFAULT_BOARDS = [
  {
    name: 'Backlog',
  },
  {
    name: 'A Fazer',
  },
  {
    name: 'Fazendo',
  },
  {
    name: 'Concluído',
  },
];

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private emailService: InviteEmailService,
  ) {}

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
          Boards: {
            createMany: {
              data: DEFAULT_BOARDS,
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
            lastName: true,
            email: true,
            password: false,
            createdAt: true,
            updatedAt: true,
          },
        },
        UsersIntegrated: {
          include: {
            Users: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                password: false,
                createdAt: true,
                updatedAt: true,
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

  async removeBind(userId: number, id: number) {
    await this.findOne(userId, id);

    await this.prisma.userProjects.deleteMany({
      where: {
        projectId: id,
      },
    });
  }

  async inviteMember(
    userId: number,
    id: number,
    emails: Array<InviteProjectDto>,
  ) {
    const project = await this.findOne(userId, id);

    const promises = [];

    emails.forEach((data) => {
      promises.push(
        this.emailService
          .execute({
            email: data.email,
            idProject: id,
            project: project.title,
          })
          .catch((err) => console.log(err)),
      );
    });

    await Promise.all(promises);
  }
}
