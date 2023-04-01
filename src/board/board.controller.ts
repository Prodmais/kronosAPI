import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto, EditBoardDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post('/')
  create(@Body() data: CreateBoardDto) {
    return this.boardService.create(data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAll(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findAll(id);
  }

  @Get('/getOne/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findOne(id);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: EditBoardDto) {
    return this.boardService.update(id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.delete(id);
  }
}
