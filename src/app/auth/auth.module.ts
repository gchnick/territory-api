import { Module, OnModuleInit, Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { SharedModule } from "@app/shared/shared.module";
import { UserModule } from "@app/user/user.module";

import { AuthChecker } from "@contexts/registry/auth/application/sign-in/auth-checker";
import { SignInQueryHandler } from "@contexts/registry/auth/application/sign-in/sign-in-query-handler";
import { UserRepository } from "@contexts/registry/users/domain/user-repository";
import Logger from "@contexts/shared/domain/logger";
import { QueryHandlers } from "@contexts/shared/infrastructure/query-bus/query-handlers";

import { AuthController } from "./api/auth-post.controller";

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
];

@Module({
  imports: [SharedModule, UserModule],
  controllers: [AuthController],
  providers: [...AUTH_PROVIDERS],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private queryHandlers: QueryHandlers,
    private s: SignInQueryHandler,
  ) {}

  onModuleInit() {
    this.#addQueryHandlers();
  }

  #addQueryHandlers() {
    this.queryHandlers.add([this.s]);
  }
}
