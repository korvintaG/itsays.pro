import { IsString, IsOptional } from 'class-validator';

export class CreateAnonymousDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  finger_point: string;
}

