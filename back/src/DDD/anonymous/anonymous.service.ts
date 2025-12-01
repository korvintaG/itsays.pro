import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnonymousDto } from './dto/create-anonymous.dto';
import { UpdateAnonymousDto } from './dto/update-anonymous.dto';
import { Anonymous } from './entities/anonymous.entity';

@Injectable()
export class AnonymousService {
  constructor(
    @InjectRepository(Anonymous)
    private readonly anonymousRepository: Repository<Anonymous>,
  ) {}

  /**
   * Генерирует случайный cookie для идентификации анонимного пользователя
   * Формат: 32 символа (буквы и цифры)
   */
  private generateCookie(): string {
    const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let cookie = '';
    
    for (let i = 0; i < 32; i++) {
      cookie += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    
    return cookie;
  }

  /**
   * Генерирует уникальный cookie, проверяя его отсутствие в базе данных
   */
  private async generateUniqueCookie(): Promise<string> {
    let cookie: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100; // Защита от бесконечного цикла

    while (!isUnique && attempts < maxAttempts) {
      cookie = this.generateCookie();
      const existingAnonymous = await this.anonymousRepository.findOne({ where: { cookie } });
      
      if (!existingAnonymous) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique cookie after maximum attempts');
    }

    return cookie;
  }

  async create(createAnonymousDto: CreateAnonymousDto): Promise<Anonymous> {
    // Генерируем уникальный cookie
    const cookie = await this.generateUniqueCookie();

    const anonymous = this.anonymousRepository.create({
      ...createAnonymousDto,
      cookie,
    });
    
    return await this.anonymousRepository.save(anonymous);
  }

  async findAll(): Promise<Anonymous[]> {
    return await this.anonymousRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Anonymous> {
    const anonymous = await this.anonymousRepository.findOne({ where: { id } });
    if (!anonymous) {
      throw new NotFoundException(`Anonymous user with ID ${id} not found`);
    }
    return anonymous;
  }

  async findByCookie(cookie: string): Promise<Anonymous | null> {
    return await this.anonymousRepository.findOne({ where: { cookie } });
  }

  async update(id: number, updateAnonymousDto: UpdateAnonymousDto): Promise<Anonymous> {
    const anonymous = await this.findOne(id);
    Object.assign(anonymous, updateAnonymousDto);
    return await this.anonymousRepository.save(anonymous);
  }

  async remove(id: number): Promise<void> {
    const anonymous = await this.findOne(id);
    await this.anonymousRepository.remove(anonymous);
  }
}

