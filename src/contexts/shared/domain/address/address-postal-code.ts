import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressPostalCode extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 5;
  constructor(value: string) {
    super(value, AddressPostalCode.MAXIMUM_CHARACTERS);
  }
}
