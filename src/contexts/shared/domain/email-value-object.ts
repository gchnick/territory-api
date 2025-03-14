import { StringNoEmptyWithCharacterMaximum } from "./string-no-empty-with-character-maximum";

export class EmailValueObject extends StringNoEmptyWithCharacterMaximum {
  static MAX_CHARACTERS = 320;
  constructor(value: string) {
    super(value, EmailValueObject.MAX_CHARACTERS);
  }
}
