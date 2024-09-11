import { TerritoryEntity } from "@/contexts/Overseer/territories/infrastructure/persistence/typeorm/territory-entity";
import { RoleEntity } from "@/contexts/shared/users/infrastructure/persistence/typeorm/role-entity";
import { UserEntity } from "@/contexts/shared/users/infrastructure/persistence/typeorm/user-entity";

export const TYPE_ORM_ENTITIES = [
  UserEntity,
  RoleEntity,
  TerritoryEntity,
];
