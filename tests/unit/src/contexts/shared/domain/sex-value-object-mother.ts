import { Sex, SexValueObject } from "@/contexts/shared/domain/sex-value-object";

export const SexValueObjectMother = {
  create(value?: Sex) {
    const randomSex =
      Object.values(Sex)[Math.floor(Math.random() * Object.values(Sex).length)];
    return new SexValueObject(value ?? randomSex);
  },
};
