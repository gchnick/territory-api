import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { AuthChecker } from "@/contexts/shared/auth/application/sign-in/auth-checker";
import { SignInQueryHandler } from "@/contexts/shared/auth/application/sign-in/sign-in-query-handler";
import { Encode } from "@/contexts/shared/auth/domain/encode";
import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { Bcrypt } from "@/contexts/shared/infrastructure/encode/bcrypt";
import { NestAuthPrismaService } from "@/contexts/shared/infrastructure/persistence/prisma/services/nest-auth-prisma.service";
import { UserRepository } from "@/contexts/shared/users/domain/user-repository";
import { UserPrisma } from "@/contexts/shared/users/infrastructure/persistence/user-prisma";

import { AuthPostController } from "./api/auth-post.controller";

@Module({
  imports: [JwtModule],
  controllers: [AuthPostController],
  providers: [
    AuthChecker,
    SignInQueryHandler,
    UserPrisma,
    Bcrypt,
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
    {
      provide: UserRepository,
      useFactory(p: NestAuthPrismaService) {
        return new UserPrisma(p);
      },
      inject: [NestAuthPrismaService],
    },
    {
      provide: Encode,
      useExisting: Bcrypt,
    },
  ],
  exports: [UserRepository, Encode, Jwt, "AuthQueryHandlers"],
})
export class AuthModule {}
