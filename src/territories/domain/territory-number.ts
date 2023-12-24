import { NumberValueObject } from '@shared/domain/value-object/number-value-object';
import { TerritoryNumberExceeded } from './territory-number-exceeded';

export class TerritoryNumber extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.#ensureTerritoryNumberIsLessThanOrEqualToOneHundred(value);
  }

  #ensureTerritoryNumberIsLessThanOrEqualToOneHundred(value: number) {
    if (100 < value) {
      throw new TerritoryNumberExceeded(
        `The Territory Number <${value}> is mayor that 100`,
      );
    }
  }
}
