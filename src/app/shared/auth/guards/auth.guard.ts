import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Jwt } from "@/contexts/shared/auth/domain/jwt";
import { JwtPayload } from "@/contexts/shared/auth/domain/jwt-payload";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: Jwt,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.#extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>("jwtSecret"),
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  #extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.get("authorization")?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
