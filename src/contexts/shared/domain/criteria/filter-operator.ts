import { EnumValueObject } from "../value-object/enum-value-object";
import { InvalidArgumentError } from "../value-object/invalid-argument-error";

export enum Operator {
  EQUAL = "=",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
  LOWER_THAN = "<",
  LOWER_THAN_OR_EQUAL = "<=",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
}

export class FilterOperator extends EnumValueObject<Operator> {
  constructor(value: Operator) {
    super(value, Object.values(Operator));
  }

  static fromPrimitive(operator: string) {
    return new FilterOperator(Operator[operator as keyof typeof Operator]);
  }

  static fromValue(value: string): FilterOperator {
    for (const operatorValue of Object.values(Operator)) {
      if (value === operatorValue.toString()) {
        return new FilterOperator(operatorValue);
      }
    }

    throw new InvalidArgumentError(`The filter operator ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Operator): void {
    throw new InvalidArgumentError(`The filter operator ${value} is invalid`);
  }

  static equal() {
    return this.fromValue(Operator.EQUAL);
  }

  isPositive(): boolean {
    return (
      this.value !== Operator.NOT_EQUAL && this.value !== Operator.NOT_CONTAINS
    );
  }

  isContains(): boolean {
    return this.value.valueOf() === Operator.CONTAINS.valueOf();
  }

  isNotContains(): boolean {
    return this.value.valueOf() === Operator.NOT_CONTAINS.valueOf();
  }

  isNotEquals(): boolean {
    return this.value.valueOf() === Operator.NOT_EQUAL.valueOf();
  }

  isGreaterThan(): boolean {
    return this.value.valueOf() === Operator.GREATER_THAN.valueOf();
  }

  isGreaterThanOrEqual(): boolean {
    return this.value.valueOf() === Operator.GREATER_THAN_OR_EQUAL.valueOf();
  }

  isLowerThan(): boolean {
    return this.value.valueOf() === Operator.LOWER_THAN.valueOf();
  }

  isLowerThanOrEqual(): boolean {
    return this.value.valueOf() === Operator.LOWER_THAN_OR_EQUAL.valueOf();
  }
}
