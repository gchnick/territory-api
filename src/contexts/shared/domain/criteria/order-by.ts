import { StringValueObject } from "../value-object/string-value-object";

export class OrderBy extends StringValueObject {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(value: string) {
    super(value);
  }
}
