import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SprintService } from './sprint.service';
import { CreateSprintDto, EditSprintDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('sprint')
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateSprintDto) {
    return await this.sprintService.create(data);
  }

  @Get('/project/:projectId')
  getAll(@Param('projectId', ParseIntPipe) id: number) {
    return this.sprintService.findAll(id);
  }

  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.sprintService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EditSprintDto,
  ) {
    return await this.sprintService.update(id, data);
  }

  @Put('/end/:id')
  async endSprint(@Param('id', ParseIntPipe) id: number) {
    return await this.sprintService.endSprint(id);
  }
}
