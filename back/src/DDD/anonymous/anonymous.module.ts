import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnonymousService } from './anonymous.service';
import { AnonymousController } from './anonymous.controller';
import { Anonymous } from './entities/anonymous.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anonymous])],
  controllers: [AnonymousController],
  providers: [AnonymousService],
  exports: [AnonymousService],
})
export class AnonymousModule {}

