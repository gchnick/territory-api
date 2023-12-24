import Logger from '@shared/domain/logger';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoriesRespose } from './territories-response';

export class TerritoriesFinder {
  constructor(
    private log: Logger,
    private territoryRepository: TerritoryRepository,
  ) {}

  async run() {
    this.log.info(`Fetching all territories`);
    const territories = await this.territoryRepository.searchAll();

    return new TerritoriesRespose(territories);
  }
}
