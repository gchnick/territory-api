import { Command } from 'src/shared/domain/command';
import { Limits } from './territory-limits';

type Params = {
  id: string;
  number: number;
  label: string;
  limits: Limits;
  lastDateCompleted: Date;
};

export class CreateTerritoryCommand extends Command {
  id: string;
  number: number;
  label: string;
  limits: Limits;
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
