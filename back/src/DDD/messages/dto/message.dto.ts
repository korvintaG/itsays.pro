import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class MessageDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  text: string;

  @Expose()
  @IsString()
  @IsOptional()
  author_name?: string;

  @Expose()
  @IsNumber()
  thing_id: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  anonymous_user_id?: number;

  @Expose()
  @IsDate()
  created_at: Date;

  @Expose()
  @IsDate()
  updated_at: Date;
}

