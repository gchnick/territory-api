import { RoleDescription } from "./role/role-description";
import { RoleId } from "./role/role-id";
import { Role, RoleName } from "./role/role-name";

export type UserRolePrimitives = {
  id: string;
  name: Role;
  description: string;
};

export class UserRole {
  readonly id: RoleId;
  readonly name: RoleName;
  readonly description: RoleDescription;

  constructor(id: RoleId, name: RoleName, description: RoleDescription) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    description: string;
  }): UserRole {
    return new UserRole(
      new RoleId(plainData.id),
      RoleName.fromValue(plainData.name),
      new RoleDescription(plainData.description),
    );
  }

  toPrimitives(): UserRolePrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
    };
  }
}
