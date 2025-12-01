import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ThingsService } from './things.service';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { ThingDto } from './dto/thing.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';

@Controller('things')
@Serialize(ThingDto)
export class ThingsController {
  constructor(private readonly thingsService: ThingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: Request,
    @Body() createThingDto: CreateThingDto) {
    return this.thingsService.create(req.user, createThingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.thingsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.thingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateThingDto: UpdateThingDto,
  ) {
    return this.thingsService.update(req.user, id, updateThingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.thingsService.remove(req.user, id);
  }
}

