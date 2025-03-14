import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressStreetAvenue extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 100;
  constructor(value: string) {
    super(value, AddressStreetAvenue.MAXIMUM_CHARACTERS);
  }
}
