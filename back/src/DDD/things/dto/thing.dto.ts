import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional, Length } from 'class-validator';

export class ThingDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  UIN: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsNumber()
  user_id: number;

  @Expose()
  @IsDate()
  created_at: Date;

  @Expose()
  @IsDate()
  updated_at: Date;

  @Expose()
  @IsString()
  @IsOptional()
  image_URL: string;

  @Expose()
  @IsString()
  @IsOptional()
  image_URL_brief: string;


}

