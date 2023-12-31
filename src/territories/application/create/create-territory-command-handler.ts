import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { CreateTerritoryCommand } from '@territories/domain/create-territory-command';
import { TerritoryId } from '@territories/domain/territory-id';
import { TerritoryLabel } from '@territories/domain/territory-label';
import { TerritoryLastDateCompleted } from '@territories/domain/territory-last-date-completed';
import { TerritoryLimits } from '@territories/domain/territory-limits';
import { TerritoryNumber } from '@territories/domain/territory-number';
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
    const limits = TerritoryLimits.fromPrimitives(command.limits);
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
