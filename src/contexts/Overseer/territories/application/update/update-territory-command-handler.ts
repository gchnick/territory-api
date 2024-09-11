import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "../../domain/territory-id";
import { TerritoryIsLocked } from "../../domain/territory-is-locked";
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
      id,
      label,
      number,
      sector,
      locality,
      localityInPart,
      map,
      quantityHouses,
      isLocked,
      lastDateCompleted,
    } = command;

    const territoryId = new TerritoryId(id);

    await this.territoryUpdater.update(territoryId, {
      label: label ? new TerritoryLabel(label) : undefined,
      number: number ? new TerritoryNumber(number) : undefined,
      sector: sector ? new TerritorySector(sector) : undefined,
      locality: locality ? new TerritoryLocality(locality) : undefined,
      localityInPart: localityInPart
        ? new TerritoryLocalityInPart(localityInPart)
        : undefined,
      map: map ? new TerritoryMap(map) : undefined,
      quantityHouses: quantityHouses
        ? new TerritoryQuantityHouse(quantityHouses)
        : undefined,
      isLocked: isLocked ? new TerritoryIsLocked(isLocked) : undefined,
      lastDateCompleted: lastDateCompleted
        ? new TerritoryLastDateCompleted(lastDateCompleted)
        : undefined,
    });
  }
}
