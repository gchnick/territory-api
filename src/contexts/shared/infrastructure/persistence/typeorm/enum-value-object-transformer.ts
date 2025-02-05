import { NewableClass } from "@/shared/domain/newable-class";
import { EnumValueObject } from "@/shared/domain/value-object/enum-value-object";

export const EnumValueObjectTransformer = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EnumValueObject: NewableClass<EnumValueObject<any>>,
) => {
  return {
    to: (value: EnumValueObject<T>): T => value.value,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    from: (value: T): EnumValueObject<T> => new EnumValueObject(value),
  };
};
