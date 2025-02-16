import { CongregationMother } from "@/tests/unit/src/contexts/Overseer/congregation/domain/congregation-mother";
import { TerritoryMother } from "@/tests/unit/src/contexts/Overseer/territories/domain/territory-mother";

import { CongregationRepository } from "@/contexts/Overseer/congregations/domain/congregation-repository";
import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

async function saveInitialTerritories(
  repo: TerritoryRepository,
  territories: Territory[],
): Promise<void> {
  await Promise.all(territories.map(territory => repo.save(territory)));
}

export const prepareTerritoriesInDB = async (
  congregationRepo: CongregationRepository,
  territoryRepo: TerritoryRepository,
) => {
  const LENGTH_INITIAL_TERRITORY = 3;

  await territoryRepo.deleteAll();
  await congregationRepo.deleteAll();
  const congregation = CongregationMother.create();
  const territories = TerritoryMother.createSuccession(
    LENGTH_INITIAL_TERRITORY,
    congregation.number.value,
  );
  await congregationRepo.save(congregation);
  await saveInitialTerritories(territoryRepo, territories);
  return { congregation, territories };
};
