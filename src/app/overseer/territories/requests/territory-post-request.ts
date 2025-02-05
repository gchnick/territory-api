import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class TerritoryPostRequest {
  @IsBoolean()
  @IsOptional()
  currentAssigned!: boolean;

  @IsNumber()
  congregationId!: number;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsDateString()
  lastDateCompleted!: string;

  @IsString()
  @IsNotEmpty()
  locality!: string;

  @IsString()
  @IsOptional()
  localityInPart?: string;

  @IsString()
  @IsOptional()
  map!: string;

  @IsNumber()
  number!: number;

  @IsNumber()
  quantityHouses!: number;

  @IsString()
  @IsOptional()
  sector?: string;
}
