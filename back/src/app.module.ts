import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './DDD/users/entities/user.entity';
import { TelegramSessions } from './DDD/telegram/registration/entities/telegram-sessions.entity';
import { TelegramMessage } from './DDD/telegram/messages/entities/telegram-message.entity';
import { Thing } from './DDD/things/entities/thing.entity';
import { Message } from './DDD/messages/entities/message.entity';
import { Anonymous } from './DDD/anonymous/entities/anonymous.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesModule } from './files/files.module';

import { TelegramModule } from './DDD/telegram/registration/telegram.module';
import { TelegramMessagingModule } from './DDD/telegram/messages/telegram-messages.module';
import { UsersModule } from './DDD/users/users.module';
import { ThingsModule } from './DDD/things/things.module';
import { MessagesModule } from './DDD/messages/messages.module';
import { AnonymousModule } from './DDD/anonymous/anonymous.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as const,
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [
            User,
            TelegramSessions,
            TelegramMessage,
            Thing,
            Message,
            Anonymous,
          ],
          synchronize: true,
        };
        
        console.log('=== DATABASE CONNECTION CONFIG ===');
        console.log('Host:', dbConfig.host);
        console.log('Port:', dbConfig.port);
        console.log('Username:', dbConfig.username);
        console.log('Password:', dbConfig.password);
        console.log('Database:', dbConfig.database);
        console.log('==================================');
        
        return dbConfig;
      },
    }),

    TelegramModule.forRoot(),
    TelegramMessagingModule,
    ScheduleModule.forRoot(),
    UsersModule,
    ThingsModule,
    FilesModule,
    MessagesModule,
    AnonymousModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
