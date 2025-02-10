import { StringValueObject } from "../value-object/string-value-object";

export class FilterField extends StringValueObject {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(value: string) {
    super(value);
  }
}
