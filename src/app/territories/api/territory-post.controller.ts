import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

import { Roles } from "@app/auth/decorators/roles.decorator";
import { AuthGuard } from "@app/auth/guards/auth.guard";
import { RolesGuard } from "@app/auth/guards/roles.guard";

import { CreateTerritoryCommand } from "@contexts/registry/territories/domain/create-territory-command";
import { Role } from "@contexts/registry/users/domain/user-role";
import { CommandBus } from "@contexts/shared/domain/command-bus";
import Logger from "@contexts/shared/domain/logger";
import { InvalidArgumentError } from "@contexts/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@contexts/shared/domain/value-object/uuid";

import { TerritoryPostRequest } from "./requests/territory-post-request";

@Controller()
export class TerritoryPostController {
  constructor(
    private readonly log: Logger,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPostRequest,
    @Request() request: FastifyRequest,
    @Response() reply: FastifyReply,
  ) {
    try {
      const { id, number, label, limits, lastDateCompleted } = body;
      const createTerritoryCommand = new CreateTerritoryCommand({
        id: id ?? Uuid.random().value,
        number,
        label,
        limits,
        lastDateCompleted: new Date(lastDateCompleted),
      });

      await this.commandBus.dispatch(createTerritoryCommand);
      const url = new URL(request.url);
      await reply.header(
        "location",
        `${url.pathname}/${createTerritoryCommand.id}`,
      );
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
