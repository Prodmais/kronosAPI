import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBoardDto) {
    const isProjectExist = await this.prisma.projects.findUnique({
      where: {
        id: data.projectId,
      },
    });

    return await this.prisma.boards.create({
      data: data,
    });
  }
}
