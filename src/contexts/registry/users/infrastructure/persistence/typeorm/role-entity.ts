import { EntitySchema } from "typeorm";

import { EnumValueObjectTransformer } from "@/contexts/shared/infrastructure/persistence/typeorm/enum-value-object-transformer";
import { ValueObjectTransformer } from "@/contexts/shared/infrastructure/persistence/typeorm/value-object-transformer";

import { RoleDescription } from "../../../domain/role/role-description";
import { RoleId } from "../../../domain/role/role-id";
import { RoleName } from "../../../domain/role/role-name";
import { UserRole } from "../../../domain/user-role";

export const RoleEntity = new EntitySchema<UserRole>({
  name: "UserRole",
  tableName: "roles",
  target: UserRole,
  columns: {
    id: {
      type: "uuid",
      primary: true,
      transformer: ValueObjectTransformer(RoleId),
    },
    name: {
      type: "varchar",
      length: 20,
      unique: true,
      nullable: false,
      transformer: EnumValueObjectTransformer(RoleName),
    },
    description: {
      type: "varchar",
      nullable: true,
      transformer: ValueObjectTransformer(RoleDescription),
    },
  },
});
