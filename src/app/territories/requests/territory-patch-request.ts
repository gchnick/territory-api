import { PartialType } from "@nestjs/mapped-types";

import { TerritoryPutRequest } from "./territory-put-request";

export class TerritoryPatchRequest extends PartialType(TerritoryPutRequest) {}
