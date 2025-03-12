import { Command } from "@/shared/domain/command";
import { CommandHandler } from "@/shared/domain/command-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { CongregationId } from "@/contexts/Overseer/congregations/domain/congregation-id";
import { TerritoryCurrentAssigned } from "@/contexts/Overseer/territories/domain/territory-current-assigned";
import { TerritoryId } from "@/contexts/Overseer/territories/domain/territory-id";
import { TerritoryLabel } from "@/contexts/Overseer/territories/domain/territory-label";
import { TerritoryLastDateCompleted } from "@/contexts/Overseer/territories/domain/territory-last-date-completed";
import { TerritoryLocality } from "@/contexts/Overseer/territories/domain/territory-locality";
import { TerritoryMap } from "@/contexts/Overseer/territories/domain/territory-map";
import { TerritoryNumber } from "@/contexts/Overseer/territories/domain/territory-number";
import { TerritoryQuantityHouse } from "@/contexts/Overseer/territories/domain/territory-quantity-house";
import { TerritorySector } from "@/contexts/Overseer/territories/domain/territory-sector";

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
      congregationId,
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
    const congregationIdValue = new CongregationId(congregationId);

    await this.territoryUpdater.update(territoryId, congregationIdValue, {
      currentAssigned: currentAssigned
        ? new TerritoryCurrentAssigned(currentAssigned)
        : undefined,
      label: label ? new TerritoryLabel(label) : undefined,
      lastDateCompleted: lastDateCompleted
        ? new TerritoryLastDateCompleted(lastDateCompleted)
        : undefined,
      locality: locality ? new TerritoryLocality(locality) : undefined,
      localityInPart: localityInPart
        ? new TerritoryLocality(localityInPart)
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
