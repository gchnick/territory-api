import { EnumValueObject } from "@/contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

export enum Hope {
  OTHER_SHEEP = "OTHER_SHEEP",
  ANOINTED = "ANOINTED",
}

export class PublisherHope extends EnumValueObject<Hope> {
  constructor(value: Hope) {
    super(value, Object.values(Hope));
  }

  static fromValue(value: string): PublisherHope {
    for (const hopeTypeValue of Object.values(Hope)) {
      if (value === hopeTypeValue.toString()) {
        return new PublisherHope(hopeTypeValue);
      }
    }

    throw new InvalidArgumentError(`The Hope type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Hope): void {
    throw new InvalidArgumentError(`The Hope type <${value}> is invalid`);
  }
}
