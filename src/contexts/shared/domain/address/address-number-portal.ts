import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressNumberPortal extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 10;
  constructor(value: string) {
    super(value, AddressNumberPortal.MAXIMUM_CHARACTERS);
  }
}
