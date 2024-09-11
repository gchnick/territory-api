import { Command } from "@/shared/domain/command";

type Params = {
  id: string;
  number?: number;
  label?: string;
  sector?: string;
  locality?: string;
  localityInPart?: string;
  map?: string;
  quantityHouses?: number;
  isLocked?: boolean;
  lastDateCompleted?: Date;
};

export class UpdateTerritoryCommand extends Command {
  id: string;
  number?: number;
  label?: string;
  sector?: string;
  locality?: string;
  localityInPart?: string;
  map?: string;
  quantityHouses?: number;
  isLocked?: boolean;
  lastDateCompleted?: Date;

  constructor({
    id,
    number,
    label,
    sector,
    locality,
    localityInPart,
    map,
    quantityHouses,
    isLocked,
    lastDateCompleted,
  }: Params) {
    super();
    this.id = id;
    this.number = number;
    this.label = label;
    this.sector = sector;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.map = map;
    this.quantityHouses = quantityHouses;
    this.isLocked = isLocked;
    this.lastDateCompleted = lastDateCompleted;
  }
}
