import { Command } from "@contexts/shared/domain/command";
import { CommandHandler } from "@contexts/shared/domain/command-handler";

import { DeleteTerritoryCommand } from "../../domain/delete-territory-command";
import { TerritoryId } from "../../domain/territory-id";
import { TerritoryDeleter } from "./territory-deleter";

export class DeleteTerritoryCommandHandler
  implements CommandHandler<DeleteTerritoryCommand>
{
  constructor(private territoryDeleter: TerritoryDeleter) {}

  subscribedTo(): Command {
    return DeleteTerritoryCommand;
  }

  async handle(command: DeleteTerritoryCommand): Promise<void> {
    const id = new TerritoryId(command.id);

    await this.territoryDeleter.delete(id);
  }
}
