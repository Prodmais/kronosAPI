import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProjectDto } from './dto';
import { ProjectService } from './project.service';

@UseGuards(JwtGuard)
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('')
  create(@GetUser('id') id: number, @Body() data: CreateProjectDto) {
    return this.projectService.create(id, data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectService.findOne(userId, id);
  }
}
