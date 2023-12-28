import { StringValueObject } from '@shared/domain/value-object/string-value-object';
import { TerritoryLabelIsEmpty } from './territory-label-is-empty';
import { TerritoryLabelLengthExceeded } from './territory-label-length-exceeded';

export class TerritoryLabel extends StringValueObject {
  constructor(value: string) {
    super(value);

    this.#ensureIsNotEmpty(value);
    this.#ensureLengthIsLessThan50Characters(value);
  }

  #ensureIsNotEmpty(value: string) {
    if (value.trim().length === 0) {
      throw new TerritoryLabelIsEmpty(`The Territory Name is empty`);
    }
  }

  #ensureLengthIsLessThan50Characters(value: string) {
    if (value.length > 50) {
      throw new TerritoryLabelLengthExceeded(
        `The Territory Name <${value}> has more than 50 characters`,
      );
    }
  }
}
