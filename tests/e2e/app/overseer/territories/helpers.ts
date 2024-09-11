import { Territory } from "@/contexts/Overseer/territories/domain/territory";
import { TerritoryRepository } from "@/contexts/Overseer/territories/domain/territory-repository";

export async function saveInitialTerritories(
  repo: TerritoryRepository,
  territories: Territory[],
): Promise<void> {
  for (const t of territories) {
    await repo.save(t);
  }
}
