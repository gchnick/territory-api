import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

import { FilterPrimitives } from "@contexts/shared/domain/criteria/filter";

export class CriteriaQuery {
  @IsArray()
  filters!: FilterPrimitives[];

  @IsString()
  @IsOptional()
  orderBy!: string;

  @IsString()
  @IsOptional()
  orderType!: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  pointer?: string;
}
