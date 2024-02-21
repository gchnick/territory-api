import { InvalidArgumentError } from "../value-object/invalid-argument-error";
import { FilterField } from "./filter-field";
import { FilterOperator } from "./filter-operator";
import { FilterValue } from "./filter-value";

export type FilterPrimitives = {
  field: string;
  operator: string;
  value: string;
};

export class Filter {
  readonly field: FilterField;
  readonly operator: FilterOperator;
  readonly value: FilterValue;

  constructor(
    field: FilterField,
    operator: FilterOperator,
    value: FilterValue,
  ) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static fromValues(values: Map<string, string>): Filter {
    const field = values.get("field");
    const operator = values.get("operator");
    const value = values.get("value");

    if (!field || !operator || !value) {
      throw new InvalidArgumentError(`The filter is invalid`);
    }

    return new Filter(
      new FilterField(field),
      FilterOperator.fromValue(operator),
      new FilterValue(value),
    );
  }

  static fromPrimitives(
    field: string,
    operator: string,
    value: string,
  ): Filter {
    return new Filter(
      new FilterField(field),
      FilterOperator.fromValue(operator),
      new FilterValue(value),
    );
  }

  toPrimitives(): FilterPrimitives {
    return {
      field: this.field.value,
      operator: this.operator.value,
      value: this.value.value,
    };
  }
}
