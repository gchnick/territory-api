import type { EnviromentVariables } from "@/core/config/configuration";

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fastify from "fastify";

import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { JwtPayload } from "@/contexts/shared/auth/domain/jwt-payload";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: Jwt,
    private readonly _configService: ConfigService<EnviromentVariables>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<fastify.FastifyRequest>();
    const token = this.#extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this._jwtService.verifyAsync<JwtPayload>(token, {
        secret: this._configService.get<string>("JWT_SECRET"),
      });

      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }

  #extractTokenFromHeader(request: fastify.FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
