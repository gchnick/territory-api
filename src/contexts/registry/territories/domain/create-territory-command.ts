import { Command } from "@contexts/shared/domain/command";

import { TerritoryLimitsPrimitives } from "./territory-limits";

type Params = {
  id: string;
  number: number;
  label: string;
  limits: TerritoryLimitsPrimitives;
  lastDateCompleted: Date;
};

export class CreateTerritoryCommand extends Command {
  id: string;
  number: number;
  label: string;
  limits: TerritoryLimitsPrimitives;
  lastDateCompleted: Date;

  constructor({ id, number, label, limits, lastDateCompleted }: Params) {
    super();
    this.id = id;
    this.number = number;
    this.label = label;
    this.limits = limits;
    this.lastDateCompleted = lastDateCompleted;
  }
}
