import { Command } from "@/shared/domain/command";

type Params = {
  id: string;
  congregationId: number;
  number: number;
  label: string;
  sector?: string;
  locality: string;
  localityInPart?: string;
  quantityHouses: number;
  lastDateCompleted: Date;
};

export class CreateTerritoryCommand extends Command {
  id: string;
  congregationId: number;
  number: number;
  label: string;
  sector?: string;
  locality: string;
  localityInPart?: string;
  quantityHouses: number;
  lastDateCompleted: Date;

  constructor({
    id,
    congregationId,
    number,
    label,
    sector,
    locality,
    localityInPart,
    quantityHouses,
    lastDateCompleted,
  }: Params) {
    super();
    this.id = id;
    this.congregationId = congregationId;
    this.number = number;
    this.label = label;
    this.sector = sector;
    this.locality = locality;
    this.localityInPart = localityInPart;
    this.quantityHouses = quantityHouses;
    this.lastDateCompleted = lastDateCompleted;
  }
}
