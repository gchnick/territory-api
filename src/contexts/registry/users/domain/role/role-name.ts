import { EnumValueObject } from "@/contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

export enum Role {
  PUBLISHER = "PUBLISHER",
  PIONEER = "PIONEER",
  SERVANT = "SERVANT",
  OVERSEER = "OVERSEER",
  SERVICE_OVERSEER = "SERVICE_OVERSEER",
}

export class RoleName extends EnumValueObject<Role> {
  constructor(value: Role) {
    super(value, Object.values(Role));
  }

  static fromValue(value: string): RoleName {
    for (const userRoleTypeValue of Object.values(Role)) {
      if (value === userRoleTypeValue.toString()) {
        return new RoleName(userRoleTypeValue);
      }
    }

    throw new InvalidArgumentError(`The moment type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(value: Role): void {
    throw new InvalidArgumentError(`The role type <${value}> is invalid`);
  }
}
