import { TerritoryNumber } from '@territories/domain/territory-number';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryResponse } from './territory-response';

export class TerritoryFinder {
  constructor(private territoryRepository: TerritoryRepository) {}

  async run(number: TerritoryNumber) {
    const territory = await this.territoryRepository.findByNumber(number);

    return new TerritoryResponse(territory);
  }
}
