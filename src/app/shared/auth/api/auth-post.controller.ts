import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { CommandBus } from "@/shared/domain/command-bus";
import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@/shared/domain/value-object/uuid";

import { AuthResponse } from "@/contexts/shared/auth/application/sign-in/auth-response";
import { SignInQuery } from "@/contexts/shared/auth/application/sign-in/sign-in-query";
import { CreateUserCommand } from "@/contexts/shared/users/application/create/create-user.command";
import { UserCredentialInvalid } from "@/contexts/shared/users/domain/user-credential-invalid";

import { SignInRequest, SignUpRequest } from "../requests";

@ApiTags("Auth")
@Controller()
export class AuthPostController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  @ApiResponse({
    status: 200,
    description: "Token was generated",
    type: AuthResponse,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 403, description: "Forbidden. Credentials invalid" })
  async signIn(@Body() body: SignInRequest) {
    try {
      const { email, password } = body;
      const query = new SignInQuery(email, password);
      return await this.queryBus.ask<AuthResponse>(query);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/signup")
  @ApiResponse({ status: 201, description: "User was created" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 403, description: "Forbidden. Credentials invalid" })
  async signUp(
    @Body() body: SignUpRequest,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { name, email, password, roles } = body;

    try {
      const command = new CreateUserCommand({
        id: Uuid.random().value,
        name,
        email,
        password,
        roles,
      });

      await this.commandBus.dispatch(command);

      return response.headers.set("Location", `${request.url}/${command.id}`);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  #handlerError(error: unknown) {
    if (error instanceof InvalidArgumentError) {
      this.logger.log(error.message, "Auth");
      throw new BadRequestException(error.message);
    }

    if (error instanceof UserCredentialInvalid) {
      this.logger.log(error.message, "Auth");
      throw new UnauthorizedException(error.message);
    }

    this.logger.error("Check server logs", error);
    throw new InternalServerErrorException("Check server logs");
  }
}
