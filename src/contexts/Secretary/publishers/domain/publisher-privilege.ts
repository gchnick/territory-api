import { Nullable } from "@/contexts/shared/domain/nullable";
import { EnumValueObject } from "@/contexts/shared/domain/value-object/enum-value-object";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

import { PublisherPrivilegeCode } from "./privilege/publisher-privilege-code";
import { PublisherPrivilegeId } from "./privilege/publisher-privilege-id";
import { PublisherPrivilegeInitDate } from "./privilege/publisher-privilege-init-date";

export enum Privilege {
  ELDER = "ELDER",
  MINISTERIAL_SERVANT = "MINISTERIAL_SERVANT",
  PIONEER = "PIONEER",
  AUXILIARY_PIONEER = "AUXILIARY_PIONEER",
  SPECIAL_PIONEER = "SPECIAL_PIONEER",
  MISSIONARY = "MISSIONARY",
}

export type PublisherPrivilegePrimitives = {
  id: number;
  privilege: Privilege;
  code?: string;
  initDate?: string;
};

export class PublisherPrivilege extends EnumValueObject<Privilege> {
  readonly id: PublisherPrivilegeId;
  readonly code: Nullable<PublisherPrivilegeCode>;
  readonly initDate: Nullable<PublisherPrivilegeInitDate>;

  constructor(params: {
    value: Privilege;
    id: PublisherPrivilegeId;
    code?: Nullable<PublisherPrivilegeCode>;
    initDate?: Nullable<PublisherPrivilegeInitDate>;
  }) {
    super(params.value, Object.values(Privilege));
    this.id = params.id;
  }

  static fromPrimitives(params: {
    id: number;
    privilege: string;
    code?: string;
    initDate?: string;
  }): PublisherPrivilege {
    const id = new PublisherPrivilegeId(params.id);
    const code = params.code
      ? new PublisherPrivilegeCode(params.code)
      : undefined;
    const initDate = params.initDate
      ? PublisherPrivilegeInitDate.fromValue(params.initDate)
      : undefined;

    for (const privilegeTypeValue of Object.values(Privilege)) {
      if (params.privilege === privilegeTypeValue.toString()) {
        return new PublisherPrivilege({
          id,
          value: privilegeTypeValue,
          code,
          initDate,
        });
      }
    }

    throw new InvalidArgumentError(
      `The Privilege type ${params.privilege} is invalid`,
    );
  }

  toPrimitives(): PublisherPrivilegePrimitives {
    return {
      id: this.id.value,
      privilege: this.value,
      code: this.code?.value,
      initDate: this.initDate?.value,
    };
  }

  protected throwErrorForInvalidValue(value: Privilege): void {
    throw new InvalidArgumentError(`The Privilege type <${value}> is invalid`);
  }
}
