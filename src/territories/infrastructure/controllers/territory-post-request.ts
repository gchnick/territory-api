import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { Limits } from 'last/territories/models/types';
export class TerritoryPostRequest {
  @IsUUID()
  id: string;

  @IsNumber()
  number: number;

  @IsString()
  label: string;

  limits: Limits;

  @IsDate()
  lastDateCompleted: Date;
}
