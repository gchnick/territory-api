import { BooleanValueObject } from "../value-object/boolean-value-object";
import { StringValueObject } from "../value-object/string-value-object";

export class FilterValue extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  parceValue() {
    return BooleanValueObject.isBooleanParse(this.value);
  }
}
