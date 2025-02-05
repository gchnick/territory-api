import { Module } from "@nestjs/common";

import { Bcrypt } from "@/shared/infrastructure/encode/bcrypt";

import { Encode } from "@/contexts/shared/auth/domain/encode";
import { NestPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/nest-prisma-service";
import { CreateUserCommandHandler } from "@/contexts/shared/users/application/create/create-user-command-handler";
import { UserCreator } from "@/contexts/shared/users/application/create/user-creator";
import { ExistsByIdQueryHandler } from "@/contexts/shared/users/application/exists/exists-by-id-query-handler";
import { UserQuestioner } from "@/contexts/shared/users/application/exists/user-questioner";
import { FindByEmailQueryHandler } from "@/contexts/shared/users/application/find-by-email/find-by-email-query-handler";
import { UserFinder } from "@/contexts/shared/users/application/find-by-email/user-finder";
import { UpdateUserCommandHandler } from "@/contexts/shared/users/application/update/update-user-command-handler";
import { UserUpdater } from "@/contexts/shared/users/application/update/user-updater";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserPrisma } from "@/contexts/shared/users/infrastructure/persistence/user-prisma";

import { UserPutController } from "./api/user-put.controller";

@Module({
  imports: [],
  controllers: [UserPutController],
  providers: [
    UserPrisma,
    {
      provide: UserRepository,
      useFactory(p: NestPrismaService) {
        return new UserPrisma(p);
      },
      inject: [NestPrismaService],
    },
    UserCreator,
    UserUpdater,
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    UserFinder,
    UserQuestioner,
    FindByEmailQueryHandler,
    ExistsByIdQueryHandler,
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
      useFactory: (f: FindByEmailQueryHandler, e: ExistsByIdQueryHandler) => [
        f,
        e,
      ],
      inject: [FindByEmailQueryHandler, ExistsByIdQueryHandler],
    },
  ],
  exports: [UserRepository, Encode, "UserCommandHandlers", "UserQueryHandlers"],
})
export class UserModule {}
