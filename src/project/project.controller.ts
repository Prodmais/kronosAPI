import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
