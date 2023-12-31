import { Command } from '@shared/domain/command';

type Params = {
  id: string;
  number: number;
  label: string;
  limits: {
    cardinalPoint: string;
    limit: string;
  }[];
  lastDateCompleted: Date;
};

export class CreateTerritoryCommand extends Command {
  id: string;
  number: number;
  label: string;
  limits: {
    cardinalPoint: string;
    limit: string;
  }[];
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
