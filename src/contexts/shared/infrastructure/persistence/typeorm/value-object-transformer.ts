/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewableClass } from "@/shared/domain/newable-class";
import {
  Primitives,
  ValueObject,
} from "@/shared/domain/value-object/value-object";

export const ValueObjectTransformer = <T extends Primitives>(
  ValueObject: NewableClass<ValueObject<any>>,
) => {
  return {
    to: (value: ValueObject<T>): T => value.value,
    from: (value: T): ValueObject<T> => new ValueObject(value),
  };
};
