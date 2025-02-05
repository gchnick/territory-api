import { Uuid } from "@/shared/domain/value-object/uuid";

export class TerritoryId extends Uuid {
  // FIXME: The case of object parameter to Uuid no control here
  constructor(value: string) {
    let territoryIdParsed = value;
    if (typeof value === "object") {
      territoryIdParsed = (value as TerritoryId).value;
    }
    super(territoryIdParsed);
  }
}
