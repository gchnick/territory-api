import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { UserModule } from "@/app/shared/user/user.module";

import { AuthChecker } from "@/contexts/shared/auth/application/sign-in/auth-checker";
import { SignInQueryHandler } from "@/contexts/shared/auth/application/sign-in/sign-in-query-handler";
import { Jwt } from "@/contexts/shared/auth/domain/jwt";

import { AuthPostController } from "./api/auth-post.controller";

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthPostController],
  providers: [
    AuthChecker,
    SignInQueryHandler,
    JwtService,
    {
      provide: Jwt,
      useExisting: JwtService,
    },
    {
      provide: "AuthQueryHandlers",
      useFactory: (s: SignInQueryHandler) => [s],
      inject: [SignInQueryHandler],
    },
  ],
  exports: [Jwt, "AuthQueryHandlers"],
})
export class AuthModule {}
