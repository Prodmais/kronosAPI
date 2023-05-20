import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto, EditBoardDto } from './dto';
import { BOARD_ERROR, PROJECT_ERROR } from 'src/error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBoardDto) {
    const isProjectExist = await this.prisma.projects.findUnique({
      where: {
        id: data.projectId,
      },
    });

    if (!isProjectExist) {
      throw new NotFoundException(PROJECT_ERROR.NOT_FOUND);
    }

    try {
      return await this.prisma.boards.create({
        data: data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(BOARD_ERROR.FAIL_TO_CREATE);
        }

        throw error;
      }
    }
  }

  findAll(id: number) {
    return this.prisma.boards.findMany({
      where: {
        projectId: id,
      },
      include: {
        Tasks: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const board = await this.prisma.boards.findUnique({
      where: {
        id: id,
      },
      include: {
        Tasks: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException(BOARD_ERROR.NOT_FOUND);
    }

    return board;
  }

  async update(id: number, data: EditBoardDto) {
    await this.findOne(id);

    return await this.prisma.boards.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return await this.prisma.boards.delete({
      where: {
        id: id,
      },
    });
  }
}
