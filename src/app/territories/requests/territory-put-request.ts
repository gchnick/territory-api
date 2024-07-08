import { IsBoolean } from "class-validator";

import { TerritoryPostRequest } from "@/app/territories/requests/territory-post-request";

export class TerritoryPutRequest extends TerritoryPostRequest {
  @IsBoolean()
  isLocked!: boolean;
}
