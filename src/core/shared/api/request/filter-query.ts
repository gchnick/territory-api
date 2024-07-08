import { IsString } from "class-validator";

export class FilterQuery {
  @IsString()
  field!: string;

  @IsString()
  operator!: string;

  @IsString()
  value!: string;
}
