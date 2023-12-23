import { TerritoryRepository } from 'src/territories/domain/territory-repository';
import { TerritoriesRespose } from './territories-response';

export class TerritoriesFinder {
  constructor(private territoryRepository: TerritoryRepository) {}

  async run() {
    const territories = await this.territoryRepository.searchAll();

    return new TerritoriesRespose(territories);
  }
}
