import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressSector extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 25;
  constructor(value: string) {
    super(value, AddressSector.MAXIMUM_CHARACTERS);
  }
}
