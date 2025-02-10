import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import * as fastify from "fastify";

import { Roles } from "@/app/shared/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/shared/auth/guards/auth.guard";
import { RolesGuard } from "@/app/shared/auth/guards/roles.guard";
import { MessageResponse } from "@/app/shared/responses/message-response";

import { CommandBus } from "@/shared/domain/command-bus";
import { ExistsResponse } from "@/shared/domain/exists-response";
import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import { CreateUserCommand } from "@/contexts/shared/users/application/create/create-user.command";
import { ExistsByIdQuery } from "@/contexts/shared/users/application/exists/exists-by-id-query";
import { UpdateUserCommand } from "@/contexts/shared/users/application/update/update-user-command";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

import { UserPutRequest } from "./requests/user-put-request";

@ApiTags("User")
@Controller()
export class UserPutController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary:
      "Create or update user information and roles (Only for service overseer)",
    description: "This endpoint only has access for the rol SERVICE_OVERSEER",
  })
  @ApiBearerAuth()
  @ApiBody({
    description: "Information to create or update user",
    type: UserPutRequest,
  })
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
  @ApiOkResponse({ description: "User was updated", type: MessageResponse })
  @ApiBadRequestResponse({ description: "Bad request" })
  @ApiForbiddenResponse({
    description: "Forbidden. Restricted access",
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized. Credentials invalid" })
  @ApiInternalServerErrorResponse({
    description: "Contact your administrator",
  })
  @ApiParam({
    name: "id",
    description: "Unique user identifier",
    type: String,
    example: "842ae545-5194-44b0-8742-060fae82270b",
  })
  @Put("/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  async create(
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
    @Body(new ValidationPipe({ transform: true })) body: UserPutRequest,
    @Param("id", ParseUUIDPipe)
    id: string,
  ) {
    try {
      const { email, password, roles } = body;

      const query = new ExistsByIdQuery(id);
      const { exists } = await this.queryBus.ask<ExistsResponse>(query);

      if (exists) {
        const command = new UpdateUserCommand({
          id,
          email,
          password,
          roles,
        });

        await this.commandBus.dispatch(command);

        return reply
          .status(200)
          .send(
            new MessageResponse(`User with id <${id}> updated successfully`),
          );
      }
      if (!email || !password || !roles) {
        return new BadRequestException(
          "Email, password and roles is required to create new user",
        );
      }

      const command = new CreateUserCommand({
        id,
        email,
        password,
        roles,
      });

      await this.commandBus.dispatch(command);

      await reply
        .header("location", `/api/v2/users/${command.id}`)
        .status(201)
        .send();
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        this.logger.warn(error.message, "User");
        throw new BadRequestException(error.message);
      }
      this.logger.error("Check server logs", error);
      throw new InternalServerErrorException("Check server logs");
    }
  }
}
