import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AnonymousService } from './anonymous.service';
import { CreateAnonymousDto } from './dto/create-anonymous.dto';
import { UpdateAnonymousDto } from './dto/update-anonymous.dto';
import { AnonymousDto } from './dto/anonymous.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('anonymous')
@Serialize(AnonymousDto)
export class AnonymousController {
  constructor(private readonly anonymousService: AnonymousService) {}

  @Post()
  create(@Body() createAnonymousDto: CreateAnonymousDto) {
    return this.anonymousService.create(createAnonymousDto);
  }

  @Get()
  findAll() {
    return this.anonymousService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.anonymousService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnonymousDto: UpdateAnonymousDto,
  ) {
    return this.anonymousService.update(id, updateAnonymousDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.anonymousService.remove(id);
  }
}

