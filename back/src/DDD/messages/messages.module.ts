import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { Thing } from '../things/entities/thing.entity';
import { Anonymous } from '../anonymous/entities/anonymous.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Thing, Anonymous])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}

