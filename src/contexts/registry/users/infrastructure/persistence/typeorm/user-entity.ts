import { EntitySchema } from "typeorm";

import { ValueObjectTransformer } from "@/contexts/shared/infrastructure/persistence/typeorm/value-object-transformer";

import { User } from "../../../domain/user";
import { UserEmail } from "../../../domain/user-email";
import { UserEnabled } from "../../../domain/user-enabled";
import { UserId } from "../../../domain/user-id";
import { UserName } from "../../../domain/user-name";
import { UserPassword } from "../../../domain/user-password";
import { UserVerified } from "../../../domain/user-verified";
import { RoleEntity } from "./role-entity";

export const UserEntity = new EntitySchema<User>({
  name: "User",
  tableName: "users",
  target: User,
  columns: {
    id: {
      type: "uuid",
      primary: true,
      transformer: ValueObjectTransformer(UserId),
    },
    name: {
      type: "varchar",
      nullable: false,
      transformer: ValueObjectTransformer(UserName),
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
      transformer: ValueObjectTransformer(UserEmail),
    },
    password: {
      type: "varchar",
      nullable: false,
      transformer: ValueObjectTransformer(UserPassword),
    },
    enabled: {
      type: "bool",
      nullable: false,
      default: true,
      transformer: ValueObjectTransformer(UserEnabled),
    },
    verified: {
      type: "bool",
      nullable: false,
      default: false,
      transformer: ValueObjectTransformer(UserVerified),
    },
  },
  relations: {
    roles: {
      type: "many-to-many",
      target: RoleEntity,
      eager: true,
      joinTable: {
        name: "users__roles",
        joinColumn: {
          name: "user_id",
        },
        inverseJoinColumn: {
          name: "role_id",
        },
      },
    },
  },
});
