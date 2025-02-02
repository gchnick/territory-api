import { Command } from "@/shared/domain/command";

type Params = {
  congregationId: number;
  currentAssigned?: boolean;
  id: string;
  label: string;
  lastDateCompleted: Date;
  locality: string;
  localityInPart?: string;
  number: number;
  map?: string;
  quantityHouses: number;
  sector?: string;
};

export class CreateTerritoryCommand extends Command {
  congregationId: number;
  currentAssigned?: boolean;
  id: string;
  label: string;
  lastDateCompleted: Date;
  locality: string;
  localityInPart?: string;
  number: number;
  map?: string;
  quantityHouses: number;
  sector?: string;

  constructor({
    congregationId,
    currentAssigned,
    id,
    label,
    lastDateCompleted,
    locality,
    localityInPart,
    number,
    map,
    quantityHouses,
    sector,
  }: Params) {
    super();
    this.congregationId = congregationId;
    this.currentAssigned = currentAssigned;
    this.id = id;
    this.label = label;
    this.lastDateCompleted = lastDateCompleted;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.number = number;
    this.map = map;
    this.quantityHouses = quantityHouses;
    this.sector = sector;
  }
}
