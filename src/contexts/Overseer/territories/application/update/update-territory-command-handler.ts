import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryCurrentAssigned } from "../../domain/territory-current-assigned";
import { TerritoryId } from "../../domain/territory-id";
import { TerritoryLabel } from "../../domain/territory-label";
import { TerritoryLastDateCompleted } from "../../domain/territory-last-date-completed";
import { TerritoryLocality } from "../../domain/territory-locality";
import { TerritoryLocalityInPart } from "../../domain/territory-locality-in-part";
import { TerritoryMap } from "../../domain/territory-map";
import { TerritoryNumber } from "../../domain/territory-number";
import { TerritoryQuantityHouse } from "../../domain/territory-quantity-house";
import { TerritorySector } from "../../domain/territory-sector";
import { TerritoryUpdater } from "./territory-updater";
import { UpdateTerritoryCommand } from "./update-territory-command";

@Injectable()
export class UpdateTerritoryCommandHandler
  implements CommandHandler<UpdateTerritoryCommand>
{
  constructor(private readonly territoryUpdater: TerritoryUpdater) {}

  subscribedTo(): Command {
    return UpdateTerritoryCommand;
  }

  async handle(command: UpdateTerritoryCommand): Promise<void> {
    const {
      currentAssigned,
      id,
      label,
      lastDateCompleted,
      locality,
      localityInPart,
      map,
      number,
      quantityHouses,
      sector,
    } = command;

    const territoryId = new TerritoryId(id);

    await this.territoryUpdater.update(territoryId, {
      currentAssigned: currentAssigned
        ? new TerritoryCurrentAssigned(currentAssigned)
        : undefined,
      label: label ? new TerritoryLabel(label) : undefined,
      lastDateCompleted: lastDateCompleted
        ? new TerritoryLastDateCompleted(lastDateCompleted)
        : undefined,
      locality: locality ? new TerritoryLocality(locality) : undefined,
      localityInPart: localityInPart
        ? new TerritoryLocalityInPart(localityInPart)
        : undefined,
      map: map ? new TerritoryMap(map) : undefined,
      number: number ? new TerritoryNumber(number) : undefined,
      quantityHouses: quantityHouses
        ? new TerritoryQuantityHouse(quantityHouses)
        : undefined,
      sector: sector ? new TerritorySector(sector) : undefined,
    });
  }
}
