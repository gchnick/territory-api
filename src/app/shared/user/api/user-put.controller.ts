import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import * as fastify from "fastify";

import { Roles } from "@/app/shared/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/shared/auth/guards/auth.guard";
import { RolesGuard } from "@/app/shared/auth/guards/roles.guard";

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

  @Put("/:id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  @ApiResponse({ status: 201, description: "User was created" })
  @ApiResponse({ status: 200, description: "User was updated" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 403, description: "Forbidden. Token related" })
  async create(
    @Req() request: Request,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
    @Body(new ValidationPipe({ transform: true })) body: UserPutRequest,
    @Param("id", ParseUUIDPipe) id: string,
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

        return reply.status(200).send({
          message: `User with id <${id}> updated successfully`,
        });
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
        .header("location", `${request.url}/${command.id}`)
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
