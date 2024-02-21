import { NewableClass } from "@contexts/shared/domain/newable-class";
import {
  Primitives,
  ValueObject,
} from "@contexts/shared/domain/value-object/value-object";

export const ValueObjectTransformer = <T extends Primitives>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ValueObject: NewableClass<ValueObject<any>>,
) => {
  return {
    to: (value: ValueObject<T>): T => value.value,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    from: (value: T): ValueObject<T> => new ValueObject(value),
  };
};
