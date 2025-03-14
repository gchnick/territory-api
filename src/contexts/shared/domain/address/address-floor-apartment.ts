import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressFloorApartment extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 10;
  constructor(value: string) {
    super(value, AddressFloorApartment.MAXIMUM_CHARACTERS);
  }
}
