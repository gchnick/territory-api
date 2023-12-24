import { Territory } from '@territories/domain/territory';
import { TerritoryRepository } from '@territories/domain/territory-repository';

export async function saveInitialTerritories(
  repo: TerritoryRepository,
  territories: Territory[],
): Promise<void> {
  for (const t of territories) {
    await repo.save(t);
  }
}
