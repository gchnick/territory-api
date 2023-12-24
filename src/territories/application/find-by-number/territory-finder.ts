import Logger from '@shared/domain/logger';
import { TerritoryNotFount } from '@territories/domain/territory-not-fount';
import { TerritoryNumber } from '@territories/domain/territory-number';
import { TerritoryRepository } from '@territories/domain/territory-repository';
import { TerritoryResponse } from './territory-response';

export class TerritoryFinder {
  constructor(
    private log: Logger,
    private territoryRepository: TerritoryRepository,
  ) {}

  async run(number: TerritoryNumber) {
    this.log.info(`Finding territory by number <${number.value}>`);
    const territory = await this.territoryRepository.findByNumber(number);

    if (territory === null) {
      throw new TerritoryNotFount(
        `Territory with number <${number.value}> not found`,
      );
    }

    return new TerritoryResponse(territory);
  }
}
