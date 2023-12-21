import { Command } from 'src/shared/domain/command';
import { CommandHandler } from 'src/shared/domain/command-handler';
import { CreateTerritoryCommand } from 'src/territories/domain/create-territory-command';
import { TerritoryId } from 'src/territories/domain/territory-id';
import { TerritoryLabel } from 'src/territories/domain/territory-label';
import { TerritoryLastDateCompleted } from 'src/territories/domain/territory-last-date-completed';
import { TerritoryLimits } from 'src/territories/domain/territory-limits';
import { TerritoryNumber } from 'src/territories/domain/territory-number';
import { TerritoryCreator } from './territory-creator';

export class CreateTerritoryCommandHandler
  implements CommandHandler<CreateTerritoryCommand>
{
  constructor(private territoryCreator: TerritoryCreator) {}

  subscribedTo(): Command {
    return CreateTerritoryCommand;
  }

  async handle(command: CreateTerritoryCommand): Promise<void> {
    const id = new TerritoryId(command.id);
    const number = new TerritoryNumber(command.number);
    const label = new TerritoryLabel(command.label);
    const limits = new TerritoryLimits(command.limits);
    const lastDateCompleted = new TerritoryLastDateCompleted(
      command.lastDateCompleted,
    );

    await this.territoryCreator.run({
      id,
      number,
      label,
      limits,
      lastDateCompleted,
    });
  }
}
