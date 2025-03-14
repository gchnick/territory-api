import { StringNoEmptyWithCharacterMaximum } from "@/contexts/shared/domain/string-no-empty-with-character-maximum";

export class PublisherPhoneLabel extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 50;
  constructor(value: string) {
    super(value, PublisherPhoneLabel.MAXIMUM_CHARACTERS);
  }
}
