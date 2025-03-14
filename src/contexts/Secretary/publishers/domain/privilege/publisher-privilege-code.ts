import { StringNoEmptyWithCharacterMaximum } from "@/contexts/shared/domain/string-no-empty-with-character-maximum";

export class PublisherPrivilegeCode extends StringNoEmptyWithCharacterMaximum {
  static MAXIMUM_CHARACTERS = 10;
  constructor(value: string) {
    super(value, PublisherPrivilegeCode.MAXIMUM_CHARACTERS);
  }
}
