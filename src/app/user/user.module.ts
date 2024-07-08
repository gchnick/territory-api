import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { SharedModule } from "@/core/shared/shared.module";

import { Encode } from "@/contexts/registry/auth/domain/encode";
import { CreateUserCommandHandler } from "@/contexts/registry/users/application/create/create-user-command-handler";
import { UserCreator } from "@/contexts/registry/users/application/create/user-creator";
import { FindByEmailQueryHandler } from "@/contexts/registry/users/application/find-by-email/find-by-email-query-handler";
import { UserFinder } from "@/contexts/registry/users/application/find-by-email/user-finder";
import { UpdateUserCommandHandler } from "@/contexts/registry/users/application/update/update-user-command-handler";
import { UserUpdater } from "@/contexts/registry/users/application/update/user-updater";
import { UserRepository } from "@/contexts/registry/users/domain/user-repository";
import { RoleEntity } from "@/contexts/registry/users/infrastructure/persistence/typeorm/role-entity";
import { UserEntity } from "@/contexts/registry/users/infrastructure/persistence/typeorm/user-entity";
import { UserTypeOrm } from "@/contexts/registry/users/infrastructure/persistence/user-type-orm";
import { Bcrypt } from "@/contexts/shared/infrastructure/encode/bcrypt";

import { UserPutController } from "./api/user-put.controller";

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserPutController],
  providers: [
    {
      provide: UserRepository,
      useFactory: (d: DataSource) => new UserTypeOrm(d),
      inject: [DataSource],
    },
    UserCreator,
    UserUpdater,
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    UserFinder,
    FindByEmailQueryHandler,
    Bcrypt,
    {
      provide: Encode,
      useExisting: Bcrypt,
    },
    {
      provide: "UserCommandHandlers",
      useFactory: (
        c: CreateUserCommandHandler,
        u: UpdateUserCommandHandler,
      ) => [c, u],
      inject: [CreateUserCommandHandler, UpdateUserCommandHandler],
    },
    {
      provide: "UserQueryHandlers",
      useFactory: (f: FindByEmailQueryHandler) => [f],
      inject: [FindByEmailQueryHandler],
    },
  ],
  exports: [UserRepository, "UserCommandHandlers", "UserQueryHandlers"],
})
export class UserModule {}
