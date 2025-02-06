import { Module } from "@nestjs/common";

import { AuthModule } from "@/app/shared/auth/auth.module";

import { CreateUserCommandHandler } from "@/contexts/shared/users/application/create/create-user-command-handler";
import { UserCreator } from "@/contexts/shared/users/application/create/user-creator";
import { ExistsByIdQueryHandler } from "@/contexts/shared/users/application/exists/exists-by-id-query-handler";
import { UserQuestioner } from "@/contexts/shared/users/application/exists/user-questioner";
import { FindByEmailQueryHandler } from "@/contexts/shared/users/application/find-by-email/find-by-email-query-handler";
import { UserFinder } from "@/contexts/shared/users/application/find-by-email/user-finder";
import { UpdateUserCommandHandler } from "@/contexts/shared/users/application/update/update-user-command-handler";
import { UserUpdater } from "@/contexts/shared/users/application/update/user-updater";

import { UserPutController } from "./api/user-put.controller";

@Module({
  imports: [AuthModule],
  controllers: [UserPutController],
  providers: [
    UserCreator,
    UserUpdater,
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    UserFinder,
    UserQuestioner,
    FindByEmailQueryHandler,
    ExistsByIdQueryHandler,
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
  exports: ["UserCommandHandlers", "UserQueryHandlers"],
})
export class UserModule {}
