import { Command } from "@/contexts/shared/domain/command";
import { CommandHandler } from "@/contexts/shared/domain/command-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "../../domain/territory-id";
import { TerritoryLabel } from "../../domain/territory-label";
import { TerritoryLastDateCompleted } from "../../domain/territory-last-date-completed";
import { TerritoryLocality } from "../../domain/territory-locality";
import { TerritoryLocalityInPart } from "../../domain/territory-locality-in-part";
import { TerritoryNumber } from "../../domain/territory-number";
import { TerritoryQuantityHouse } from "../../domain/territory-quantity-house";
import { TerritorySector } from "../../domain/territory-sector";
import { CreateTerritoryCommand } from "./create-territory-command";
import { TerritoryCreator } from "./territory-creator";

@Injectable()
export class CreateTerritoryCommandHandler
  implements CommandHandler<CreateTerritoryCommand>
{
  constructor(private readonly territoryCreator: TerritoryCreator) {}

  subscribedTo(): Command {
    return CreateTerritoryCommand;
  }

  async handle(command: CreateTerritoryCommand): Promise<void> {
    const id = new TerritoryId(command.id);
    const number = new TerritoryNumber(command.number);
    const label = new TerritoryLabel(command.label);
    const sector = command.sector
      ? new TerritorySector(command.sector)
      : undefined;
    const locality = new TerritoryLocality(command.locality);
    const localityInPart = command.localityInPart
      ? new TerritoryLocalityInPart(command.localityInPart)
      : undefined;
    const quantityHouses = new TerritoryQuantityHouse(command.quantityHouses);
    const lastDateCompleted = new TerritoryLastDateCompleted(
      command.lastDateCompleted,
    );

    await this.territoryCreator.create({
      id,
      number,
      label,
      sector,
      locality,
      localityInPart,
      quantityHouses,
      lastDateCompleted,
    });
  }
}
