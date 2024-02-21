import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

import { TerritoryLimitsPrimitives } from "@contexts/registry/territories/domain/territory-limits";

export class TerritoryPostRequest {
  @IsUUID()
  @IsOptional()
  id!: string;

  @IsNumber()
  number!: number;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsArray()
  limits!: TerritoryLimitsPrimitives;

  @IsDate()
  @Type(() => Date)
  lastDateCompleted!: Date;
}
