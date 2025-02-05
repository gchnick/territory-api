import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";

import { TerritoryPutRequest } from "./territory-put-request";

export class TerritoryPatchRequest extends PartialType(TerritoryPutRequest) {
  @IsNumber()
  congregationId!: number;
}
