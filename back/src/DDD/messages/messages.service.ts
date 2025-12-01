import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto, CreateMessageResponse } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Thing } from '../things/entities/thing.entity';
import { Anonymous } from '../anonymous/entities/anonymous.entity';
import * as crypto from 'crypto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Thing)
    private readonly thingRepository: Repository<Thing>,
    @InjectRepository(Anonymous)
    private readonly anonymousRepository: Repository<Anonymous>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<CreateMessageResponse> {
    let anonymous_user_id=0;
    if  (createMessageDto.cookie) {
      const found=await this.anonymousRepository.findOne({where:{cookie:createMessageDto.cookie}})
      if (found)
        anonymous_user_id=found.id;
    }
    if (!anonymous_user_id && createMessageDto.finger_point) {
      // Формируем хэш из 255 байт (латинские буквы и цифры)
      const timestamp = new Date().getTime(); // текущая дата-время с миллисекундами
      const randomNumber = crypto.randomInt(0, Number.MAX_SAFE_INTEGER); // случайное число
      const name = createMessageDto.author_name || '';
      
      // Объединяем все данные в одну строку
      const dataString = `${createMessageDto.finger_point}|${name}|${timestamp}|${randomNumber}`;
      
      // Генерируем строку из 255 символов (a-z, A-Z, 0-9)
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let hash = '';
      let currentData = dataString;
      
      // Генерируем хэш нужной длины, расширяя его при необходимости
      while (hash.length < 255) {
        const hashBuffer = crypto.createHash('sha256').update(currentData).digest();
        
        // Преобразуем байты хэша в символы
        for (let i = 0; i < hashBuffer.length && hash.length < 255; i++) {
          const charIndex = hashBuffer[i] % chars.length;
          hash += chars[charIndex];
        }
        
        // Если нужно больше символов, создаем новый хэш от предыдущего
        if (hash.length < 255) {
          currentData = hash + hash.length;
        }
      }
      
      // Обрезаем до 255 символов на случай, если получилось больше
      hash = hash.substring(0, 255);
      const anonymous_user = await this.anonymousRepository.create({
        name: createMessageDto.author_name,
        finger_point: createMessageDto.finger_point,
        cookie: hash
      });
      anonymous_user_id=anonymous_user.id;
    }


    return {
      message_id: 0,
      text: createMessageDto.text,
      cookie: '-',
      thing_id:createMessageDto.thing_id
    }
    // Проверяем существование вещи
    /*const thing = await this.thingRepository.findOne({ where: { id: createMessageDto.thingId } });
    if (!thing) {
      throw new NotFoundException(`Thing with ID ${createMessageDto.thingId} not found`);
    }

    // Если передан anonymousId, проверяем существование анонимного пользователя
    if (createMessageDto.anonymous_id) {
      const anonymous = await this.anonymousRepository.findOne({ where: { id: createMessageDto.anonymousId } });
      if (!anonymous) {
        throw new NotFoundException(`Anonymous user with ID ${createMessageDto.anonymousId} not found`);
      }
    }

    const message = this.messageRepository.create(createMessageDto);
    return await this.messageRepository.save(message);*/
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findByThingId(thingId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { thing_id: thingId},
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
  }
}

