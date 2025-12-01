import { IsString, IsOptional, IsNumber, Length } from 'class-validator';

export class CreateThingDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString({ message: 'Поле [image_URL] должно быть строкой' })
  @Length(0, 400, {
    message: 'image_URL должен быть длиной от 0 до 400 символов',
  })image_URL: string;

}

