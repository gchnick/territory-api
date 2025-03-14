import { StringNoEmptyWithCharacterMaximum } from "../string-no-empty-with-character-maximum";

export class AddressReferencePoint extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 255;
  constructor(value: string) {
    super(value, AddressReferencePoint.MAXIMUM_CHARACTERS);
  }
}
