import { Command } from "@/shared/domain/command";

type Params = {
  congregationId: number;
  currentAssigned?: boolean;
  id: string;
  number?: number;
  label?: string;
  lastDateCompleted?: Date;
  locality?: string;
  localityInPart?: string;
  map?: string;
  quantityHouses?: number;
  sector?: string;
};

export class UpdateTerritoryCommand extends Command {
  congregationId: number;
  currentAssigned?: boolean;
  id: string;
  label?: string;
  lastDateCompleted?: Date;
  locality?: string;
  localityInPart?: string;
  map?: string;
  number?: number;
  quantityHouses?: number;
  sector?: string;

  constructor({
    congregationId,
    currentAssigned,
    id,
    label,
    lastDateCompleted,
    locality,
    localityInPart,
    map,
    number,
    quantityHouses,
    sector,
  }: Params) {
    super();
    this.congregationId = congregationId;
    this.currentAssigned = currentAssigned;
    this.id = id;
    this.label = label;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.lastDateCompleted = lastDateCompleted;
    this.map = map;
    this.number = number;
    this.quantityHouses = quantityHouses;
    this.sector = sector;
  }
}
