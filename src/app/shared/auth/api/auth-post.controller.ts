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
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import * as fastify from "fastify";

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

  @ApiOperation({
    summary: "Obtain JWT for authentication in API",
    description:
      "The endpoint is public but you must have the correct credentials to get a token",
  })
  @ApiBody({
    description: "Credentials to log in and get a token",
    type: SignInRequest,
  })
  @ApiOkResponse({
    description: "Token was generated",
    type: AuthResponse,
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiForbiddenResponse({ description: "Forbidden. Credentials invalid" })
  @ApiInternalServerErrorResponse({
    description: "Contact your administrator ",
  })
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInRequest) {
    try {
      const { email, password } = body;
      const query = new SignInQuery(email, password);
      return this.queryBus.ask<AuthResponse>(query);
    } catch (error) {
      this.#handlerError(error);
    }
  }

  @ApiOperation({
    summary: "Create credentials to log in and obtain tokes for authentication",
    description:
      "The endpoint is public but further verification is required to be able to use the credentials",
  })
  @ApiBody({ description: "User email and password", type: SignUpRequest })
  @ApiCreatedResponse({
    description:
      "User created successfully. The URL of the resource is located in the 'Location' header.",
    headers: {
      Location: {
        description: "URL of the created resource",
        schema: { type: "string" },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiInternalServerErrorResponse({
    description: "Contact your administrator ",
  })
  @Post("/signup")
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Req() request: Request,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
    @Body() body: SignUpRequest,
  ) {
    const { email, password } = body;

    try {
      const command = new CreateUserCommand({
        id: Uuid.random().value,
        email,
        password,
        roles: [],
      });

      await this.commandBus.dispatch(command);

      return reply.header("location", `${request.url}/${command.id}`).send();
    } catch (error) {
      this.#handlerError(error);
    }
  }

  #handlerError(error: unknown) {
    if (error instanceof UserCredentialInvalid) {
      this.logger.log(error.message, "Auth");
      throw new UnauthorizedException(error.message);
    }

    if (error instanceof InvalidArgumentError) {
      this.logger.log(error.message, "Auth");
      throw new BadRequestException(error.message);
    }

    this.logger.error("Check server logs", error);
    throw new InternalServerErrorException("Check server logs");
  }
}
