import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  author_name?: string;

  @IsNumber()
  thing_id: number;

  @IsString()
  @IsOptional()
  cookie?: string;

  @IsString()
  @IsOptional()
  finger_point?: string;

}

export class CreateMessageResponse {
  message_id: number;
  text: string;
  cookie: string;
  thing_id:number;
}
