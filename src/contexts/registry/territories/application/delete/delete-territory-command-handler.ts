import { Command } from "@/contexts/shared/domain/command";
import { CommandHandler } from "@/contexts/shared/domain/command-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "../../domain/territory-id";
import { DeleteTerritoryCommand } from "./delete-territory-command";
import { TerritoryDeleter } from "./territory-deleter";

@Injectable()
export class DeleteTerritoryCommandHandler
  implements CommandHandler<DeleteTerritoryCommand>
{
  constructor(private readonly territoryDeleter: TerritoryDeleter) {}

  subscribedTo(): Command {
    return DeleteTerritoryCommand;
  }

  async handle(command: DeleteTerritoryCommand): Promise<void> {
    const id = new TerritoryId(command.id);

    await this.territoryDeleter.delete(id);
  }
}
