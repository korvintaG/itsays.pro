import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThingsService } from './things.service';
import { ThingsController } from './things.controller';
import { Thing } from './entities/thing.entity';
import { FilesModule } from 'src/files/files.module';

import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Thing, User]), FilesModule],
  controllers: [ThingsController],
  providers: [ThingsService],
  exports: [ThingsService],
})
export class ThingsModule {}

