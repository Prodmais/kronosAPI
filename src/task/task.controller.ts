import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTaskDto, EditTaskDto } from './dto';
import { TaskService } from './task.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateTaskDto) {
    const task = await this.taskService.create(data);
    return task;
  }

  @Get('/board/:boardId')
  async getAll(@Param('boardId', ParseIntPipe) boardId: number) {
    return await this.taskService.findAll(boardId);
  }

  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EditTaskDto,
  ) {
    return await this.taskService.update(id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.delete(id);
  }
}
