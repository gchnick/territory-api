import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { FilterQuery } from "./filter-query";

export class CriteriaQuery {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterQuery)
  filters?: FilterQuery[];

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsString()
  @IsOptional()
  orderType?: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  cursor?: string;
}
