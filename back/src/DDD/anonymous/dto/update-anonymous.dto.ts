import { PartialType } from '@nestjs/mapped-types';
import { CreateAnonymousDto } from './create-anonymous.dto';

export class UpdateAnonymousDto extends PartialType(CreateAnonymousDto) {}

