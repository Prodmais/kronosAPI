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
import { Delete, Put } from '@nestjs/common/decorators';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProjectDto, EditProjectDto, InviteProjectDto } from './dto';
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EditProjectDto,
  ) {
    return this.projectService.update(userId, id, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser('id') userId: number) {
    return this.projectService.findAll(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBind(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectService.removeBind(userId, id);
  }

  @Post('/invite/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  invite(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: InviteProjectDto,
  ) {
    return this.projectService.inviteMember(userId, id, data);
  }
}
