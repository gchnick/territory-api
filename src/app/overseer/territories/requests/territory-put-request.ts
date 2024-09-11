import { IsBoolean } from "class-validator";

import { TerritoryPostRequest } from "@/src/app/overseer/territories/requests/territory-post-request";

export class TerritoryPutRequest extends TerritoryPostRequest {
  @IsBoolean()
  isLocked!: boolean;
}
