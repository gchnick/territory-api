import { BooleanValueObject } from "../value-object/boolean-value-object";
import { StringValueObject } from "../value-object/string-value-object";

export class FilterValue extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  hasBoolean() {
    return BooleanValueObject.isBoolean(this.value);
  }

  toBoolean() {
    return new BooleanValueObject(this.value).value;
  }
}
