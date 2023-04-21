import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSprintDto, EditSprintDto } from './dto';
import { PROJECT_ERROR, SPRINT_ERROR } from 'src/error';

@Injectable()
export class SprintService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSprintDto) {
    const projectExist = await this.prisma.projects.findUnique({
      where: {
        id: data.projectId,
      },
    });

    if (!projectExist) {
      throw new NotFoundException(PROJECT_ERROR.NOT_FOUND);
    }

    const sprintInProgress = await this.prisma.sprints.findFirst({
      where: {
        AND: [
          {
            finishDate: null,
          },
          {
            projectId: data.projectId,
          },
        ],
      },
    });

    if (sprintInProgress) {
      throw new BadRequestException(SPRINT_ERROR.IN_PROGRESS);
    }

    try {
      const sprint = await this.prisma.sprints.create({
        data: data,
      });
      return sprint;
    } catch (error) {
      throw new ForbiddenException(SPRINT_ERROR.FAIL_TO_CREATE);
    }
  }

  async findOne(id: number) {
    const sprint = await this.prisma.sprints.findUnique({
      where: {
        id: id,
      },
    });

    if (!sprint) {
      throw new NotFoundException(SPRINT_ERROR.NOT_FOUND);
    }

    return sprint;
  }

  findAll(idProject: number) {
    return this.prisma.sprints.findMany({
      where: {
        projectId: idProject,
      },
    });
  }

  async update(id: number, data: EditSprintDto) {
    await this.findOne(id);
    const sprint = await this.prisma.sprints.update({
      where: {
        id: id,
      },
      data: data,
    });

    return sprint;
  }

  async endSprint(id: number) {
    const sprint = await this.findOne(id);

    if (sprint.finishDate) {
      throw new BadRequestException(SPRINT_ERROR.IS_END);
    }

    const boards = await this.prisma.boards.findFirst({
      where: {
        AND: [
          {
            projectId: sprint.projectId,
          },
          {
            name: 'Concluído',
          },
        ],
      },
      include: {
        Tasks: true,
      },
    });

    const ids = boards.Tasks.map((t) => t.id);

    const sprintBoard = await this.prisma.boards.create({
      data: {
        name: sprint.title,
        description: this.foramatDate(sprint.startDate, sprint.endDate),
        projectId: sprint.projectId,
        isSprint: true,
      },
    });

    if (ids.length) {
      await this.prisma.tasks.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          boardId: sprintBoard.id,
        },
      });
    }

    const sprintUpdate = await this.prisma.sprints.update({
      where: {
        id: sprint.id,
      },
      data: {
        finishDate: new Date(),
      },
    });

    return sprintUpdate;
  }

  private foramatDate(startDate: Date, endDate: Date) {
    const startDay = startDate.getDate();
    const startMounth = startDate.getMonth() + 1;
    const startYear = startDate.getFullYear();

    const endDay = endDate.getDate();
    const endMounth = endDate.getMonth() + 1;
    const endYear = endDate.getFullYear();

    return `${startDay < 10 ? '0' + startDay : startDay}-${
      startMounth < 10 ? '0' + startMounth : startMounth
    }-${startYear} - ${endDay < 10 ? '0' + endDay : endDay}-${
      endMounth < 10 ? '0' + endMounth : endMounth
    }-${endYear}`;
  }
}
