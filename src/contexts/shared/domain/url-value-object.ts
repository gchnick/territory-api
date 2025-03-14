import { StringNoEmptyWithCharacterMaximum } from "./string-no-empty-with-character-maximum";

export class UrlValueObject extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 255;
  constructor(value: string) {
    super(value, UrlValueObject.MAXIMUM_CHARACTERS);
  }
}
