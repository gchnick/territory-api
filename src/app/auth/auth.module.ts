import { Module, Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UserModule } from "@/app/user/user.module";

import { SharedModule } from "@/core/shared/shared.module";

import { AuthChecker } from "@/contexts/registry/auth/application/sign-in/auth-checker";
import { SignInQueryHandler } from "@/contexts/registry/auth/application/sign-in/sign-in-query-handler";
import { UserRepository } from "@/contexts/registry/users/domain/user-repository";
import Logger from "@/contexts/shared/domain/logger";

import { AuthPostController } from "./api/auth-post.controller";

const AUTH_PROVIDERS: Provider[] = [
  {
    provide: AuthChecker,
    useFactory: (l: Logger, r: UserRepository, j: JwtService) =>
      new AuthChecker(l, r, bcrypt, j),
    inject: [Logger, UserRepository, JwtService],
  },
  {
    provide: SignInQueryHandler,
    useFactory: (a: AuthChecker) => new SignInQueryHandler(a),
    inject: [AuthChecker],
  },
  {
    provide: "AuthQueryHandlers",
    useFactory: (s: SignInQueryHandler) => [s],
    inject: [SignInQueryHandler],
  },
];

@Module({
  imports: [SharedModule, UserModule],
  controllers: [AuthPostController],
  providers: [...AUTH_PROVIDERS],
  exports: ["AuthQueryHandlers"],
})
export class AuthModule {}
