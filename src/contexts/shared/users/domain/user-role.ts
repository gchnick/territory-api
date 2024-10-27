import { Nullable } from "@/contexts/shared/domain/nullable";

import { RoleDescription } from "./role/role-description";
import { RoleId } from "./role/role-id";
import { Role, RoleName } from "./role/role-name";

export type UserRolePrimitives = {
  id: number;
  name: Role;
  description: Nullable<string>;
};

export class UserRole {
  readonly id: RoleId;
  readonly name: RoleName;
  readonly description: Nullable<RoleDescription>;

  constructor(
    id: RoleId,
    name: RoleName,
    description: Nullable<RoleDescription>,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromPrimitives(plainData: {
    id: number;
    name: string;
    description: Nullable<string>;
  }): UserRole {
    const { description } = plainData;
    return new UserRole(
      new RoleId(plainData.id),
      RoleName.fromValue(plainData.name),
      description ? new RoleDescription(description) : undefined,
    );
  }

  toPrimitives(): UserRolePrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description?.value,
    };
  }
}
