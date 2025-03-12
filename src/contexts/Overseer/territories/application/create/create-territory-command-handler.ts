import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";

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
    const congregationId = new CongregationId(command.congregationId);
    const number = new TerritoryNumber(command.number);
    const label = new TerritoryLabel(command.label);
    const sector = command.sector
      ? new TerritorySector(command.sector)
      : undefined;
    const locality = new TerritoryLocality(command.locality);
    const localityInPart = command.localityInPart
      ? new TerritoryLocality(command.localityInPart)
      : undefined;
    const quantityHouses = new TerritoryQuantityHouse(command.quantityHouses);
    const lastDateCompleted = new TerritoryLastDateCompleted(
      command.lastDateCompleted,
    );

    await this.territoryCreator.create({
      id,
      congregationId,
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
