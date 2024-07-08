import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class TerritoryPostRequest {
  @IsNumber()
  number!: number;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsNotEmpty()
  locality!: string;

  @IsString()
  @IsOptional()
  localityInPart?: string;

  @IsNumber()
  quantityHouses!: number;

  @IsDateString()
  lastDateCompleted!: string;
}
