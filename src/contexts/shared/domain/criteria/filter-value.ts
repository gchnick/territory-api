import { BooleanValueObject } from "../value-object/boolean-value-object";
import { StringValueObject } from "../value-object/string-value-object";

export class FilterValue extends StringValueObject {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(value: string) {
    super(value);
  }

  hasBoolean() {
    return BooleanValueObject.isBoolean(this.value);
  }

  toBoolean() {
    return BooleanValueObject.fromValue(this.value).value;
  }
}
