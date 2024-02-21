import { CreateTerritoryCommand } from "@contexts/registry/territories/domain/create-territory-command";
import { TerritoryId } from "@contexts/registry/territories/domain/territory-id";
import { TerritoryLabel } from "@contexts/registry/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@contexts/registry/territories/domain/territory-last-date-completed";
import { TerritoryLimits } from "@contexts/registry/territories/domain/territory-limits";
import { TerritoryNumber } from "@contexts/registry/territories/domain/territory-number";
import { Command } from "@contexts/shared/domain/command";
import { CommandHandler } from "@contexts/shared/domain/command-handler";

import { TerritoryCreator } from "./territory-creator";

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

    await this.territoryCreator.create({
      id,
      number,
      label,
      limits,
      lastDateCompleted,
    });
  }
}
