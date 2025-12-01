import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class AnonymousDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  cookie: string;

  @Expose()
  @IsDate()
  created_at: Date;

  @Expose()
  @IsDate()
  updated_at: Date;
}

