import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Response,
} from "@nestjs/common";

import { AuthResponse } from "@contexts/registry/auth/application/sign-in/auth-response";
import { SignInQuery } from "@contexts/registry/auth/application/sign-in/sign-in-query";
import { CreateUserCommand } from "@contexts/registry/users/domain/create-user.command";
import { CommandBus } from "@contexts/shared/domain/command-bus";
import Logger from "@contexts/shared/domain/logger";
import { QueryBus } from "@contexts/shared/domain/query-bus";
import { InvalidArgumentError } from "@contexts/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@contexts/shared/domain/value-object/uuid";

import { SignInRequest, SignUpRequest } from "./requests";

@Controller()
export class AuthPostController {
  constructor(
    @Inject(Logger) private readonly log: Logger,
    @Inject(CommandBus) private readonly commandBus: CommandBus,
    @Inject(QueryBus) private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() request: SignInRequest) {
    const { email, password } = request;
    const query = new SignInQuery(email, password);
    return await this.queryBus.ask<AuthResponse>(query);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signup")
  async signUp(@Body() request: SignUpRequest, @Response() res: Response) {
    const { name, email, password, roles } = request;
    const id = Uuid.random().value;
    try {
      const command = new CreateUserCommand({
        id,
        name,
        email,
        password,
        roles,
      });

      await this.commandBus.dispatch(command);

      res.headers.set("Location", `/v1/api/users/${id}`);
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        this.log.warn(error.message);
        throw new BadRequestException(error.message);
      }
      this.log.error(error);
      throw new InternalServerErrorException("Check server logs");
    }
  }
}
