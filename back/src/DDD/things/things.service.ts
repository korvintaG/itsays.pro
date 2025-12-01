import { Injectable, NotFoundException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateThingDto } from './dto/create-thing.dto';
import { UpdateThingDto } from './dto/update-thing.dto';
import { Thing } from './entities/thing.entity';
import { User } from '../users/entities/user.entity';
import { IUser } from 'src/types/custom';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';
import { ThingDto } from './dto/thing.dto';
import { unlink } from 'fs/promises';
import { STORE_FILE_PATH } from 'src/files/utils';

@Injectable()
export class ThingsService {
  constructor(
    @InjectRepository(Thing)
    private readonly thingRepository: Repository<Thing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private filesService: FilesService,

  ) {}

  private generateBriefURL(fullURL: string | undefined | null):string | undefined | null {
    if (fullURL)
      return `${path.basename(fullURL, path.extname(fullURL))}brief${path.extname(fullURL)}`
    else
      return undefined
  }

  /**
   * Генерирует случайный UIN формата: первая буква (заглавная или строчная),
   * затем 7 символов (буквы и цифры)
   * Примеры: N2098fge, Gyj678jf
   */
  private generateUIN(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Первый символ - буква (заглавная или строчная)
    const firstChar = letters[Math.floor(Math.random() * letters.length)];
    
    // Остальные 7 символов - буквы и цифры
    let rest = '';
    for (let i = 0; i < 7; i++) {
      rest += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    
    return firstChar + rest;
  }

  /**
   * Генерирует уникальный UIN, проверяя его отсутствие в базе данных
   */
  private async generateUniqueUIN(): Promise<string> {
    let uin: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100; // Защита от бесконечного цикла

    while (!isUnique && attempts < maxAttempts) {
      uin = this.generateUIN();
      const existingThing = await this.thingRepository.findOne({ where: { UIN: uin } });
      
      if (!existingThing) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique UIN after maximum attempts');
    }

    return uin;
  }

  /**
   * Обрабатывает ошибки QueryFailedError от PostgreSQL
   */
  private handleQueryFailedError(error: QueryFailedError): never {
    const pgError = error as any;
    // Код 23505 - нарушение уникального ограничения
    if (pgError.code === '23505') {
      if (pgError.constraint?.includes('user_id') || pgError.constraint?.includes('name')) {
        throw new ConflictException({
          error: 'Conflict',
          message: 'Вещь с таким именем уже существует у данного пользователя',
        });
      }
      if (pgError.constraint?.includes('UIN')) {
        throw new ConflictException({
          error: 'Conflict',
          message: 'Вещь с таким UIN уже существует',
        });
      }
      throw new ConflictException({
        error: 'Conflict',
        message: 'Нарушение уникального ограничения',
      });
    }
    // Код 23503 - нарушение внешнего ключа
    if (pgError.code === '23503') {
      throw new BadRequestException({
        error: 'Bad Request',
        message: 'Нарушение ограничения внешнего ключа',
      });
    }
    // Код 23502 - нарушение NOT NULL
    if (pgError.code === '23502') {
      throw new BadRequestException({
        error: 'Bad Request',
        message: `Обязательное поле не заполнено: ${pgError.column || 'неизвестно'}`,
      });
    }
    // Если это не обработанная ошибка PostgreSQL, пробрасываем дальше
    throw error;
  }

  async create(user:IUser, createThingDto: CreateThingDto): Promise<Thing> {
    // Проверяем существование пользователя
    //const user = await this.userRepository.findOne({ where: { id: createThingDto.user_id } });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    // Генерируем уникальный UIN
    const uin = await this.generateUniqueUIN();


    const thing = this.thingRepository.create({
      ...createThingDto,
      UIN: uin,
      //image_URL: update_image_URL,
      user_id: user.id
    });
    
    try {
      const res=await this.thingRepository.save(thing);
      const update_image_URL=await this.filesService.createRecordImage(createThingDto.image_URL, `thing_${res.id}`);
      // Обновляем только поле image_URL по res.id без загрузки всей сущности
      await this.thingRepository.update(res.id, { image_URL: update_image_URL });
      res.image_URL = update_image_URL;
      return res;

    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.handleQueryFailedError(error);
      }
      // Если это не ошибка PostgreSQL, пробрасываем дальше
      throw error;
    }
  }

  async findAll(user:IUser): Promise<ThingDto[]> {
    const res= await this.thingRepository.find({
      where: {user_id: user.id},
      order: { created_at: 'DESC' },
    });
    const resWB= res.map(el=> {
        return {...el, image_URL_brief: this.generateBriefURL(el.image_URL)}
      }
    );
    return resWB;
  }

  async findOne(id: number): Promise<ThingDto> {
    const thing = await this.thingRepository.findOne({ where: { id } });
    if (!thing) {
      throw new NotFoundException(`Thing with ID ${id} not found`);
    }
    return {
      ...thing, 
      image_URL_brief: this.generateBriefURL(thing.image_URL)};
  }

  async update(user:IUser, id: number, updateThingDto: UpdateThingDto): Promise<Thing> {
    const thing = await this.findOne(id);
    const old_image_URL = thing.image_URL; 

    if (thing.user_id!==user.id)
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'У Вас нет права на редактирование этой вещи!',
      });
    Object.assign(thing, updateThingDto);
    try {
      const new_image_URL: string | undefined = updateThingDto.image_URL;
      const update_image_URL = await this.filesService.updateRecordImage(
        old_image_URL,
        new_image_URL,
        `thing_${id}`,
      );
  
      return await this.thingRepository.save({...thing, image_URL: update_image_URL});
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.handleQueryFailedError(error);
      }
      throw error;
    }
  }

  async remove(user:IUser, id: number) {
    const thing = await this.findOne(id);
    if (thing.user_id!==user.id)
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'У Вас нет права на удаление этой вещи!',
      });
    await this.thingRepository.delete({id});
    if (thing.image_URL) {
      // удаляем файл
      await unlink(path.join(STORE_FILE_PATH(), thing.image_URL));
      await unlink(path.join(STORE_FILE_PATH(), this.generateBriefURL(thing.image_URL)));
    }
    return  {
      success: true,
      message: "Thing deleted successfully",
      id: id
    };

  }
}

