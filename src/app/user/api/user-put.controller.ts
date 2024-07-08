import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Request,
  Response,
  ValidationPipe,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";

import { CreateUserCommand } from "@/contexts/registry/users/application/create/create-user.command";
import { ExistsByIdQuery } from "@/contexts/registry/users/application/exists/exists-by-id-query";
import { UpdateUserCommand } from "@/contexts/registry/users/application/update/update-user-command";
import { CommandBus } from "@/contexts/shared/domain/command-bus";
import { ExistsResponse } from "@/contexts/shared/domain/exists-response";
import Logger from "@/contexts/shared/domain/logger";
import { QueryBus } from "@/contexts/shared/domain/query-bus";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

import { UserPostRequest } from "./requests/user-post-request";

@ApiTags("User")
@Controller()
export class UserPutController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Put("/:id")
  @ApiResponse({ status: 201, description: "User was created" })
  @ApiResponse({ status: 200, description: "User was updated" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 403, description: "Forbidden. Token related" })
  async create(
    @Request() request: FastifyRequest,
    @Response({ passthrough: true }) reply: FastifyReply,
    @Body(new ValidationPipe({ transform: true })) body: UserPostRequest,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    try {
      const { name, email, password, roles } = body;

      const query = new ExistsByIdQuery(id);
      const { exists } = await this.queryBus.ask<ExistsResponse>(query);

      if (exists) {
        const command = new UpdateUserCommand({
          id,
          name,
          email,
          password,
          roles,
        });

        await this.commandBus.dispatch(command);

        return await reply
          .status(HttpStatus.OK)
          .send({ message: `User with id <${id}> updated successfully` });
      }

      const command = new CreateUserCommand({
        id,
        name,
        email,
        password,
        roles,
      });

      await this.commandBus.dispatch(command);

      await reply.header("location", `${request.url}/${command.id}`).send();
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
