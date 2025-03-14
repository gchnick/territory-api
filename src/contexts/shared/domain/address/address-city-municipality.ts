import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressCityMunicipality extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 50;
  constructor(value: string) {
    super(value, AddressCityMunicipality.MAXIMUM_CHARACTERS);
  }
}
