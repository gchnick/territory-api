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
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";

import { CreateTerritoryCommand } from "@/contexts/registry/territories/application/create/create-territory-command";
import { CommandBus } from "@/contexts/shared/domain/command-bus";
import Logger from "@/contexts/shared/domain/logger";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@/contexts/shared/domain/value-object/uuid";

import { TerritoryPostRequest } from "../requests/territory-post-request";

@ApiTags("Territory")
@Controller()
export class TerritoryPostController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SERVICE_OVERSEER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPostRequest,
    @Request() request: FastifyRequest,
    @Response({ passthrough: true }) reply: FastifyReply,
  ) {
    try {
      const {
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted,
      } = body;

      const command = new CreateTerritoryCommand({
        id: Uuid.random().value,
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted: new Date(lastDateCompleted),
      });

      await this.commandBus.dispatch(command);

      await reply.header("location", `${request.url}/${command.id}`).send();
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        this.logger.warn(error.message, "Territory");
        throw new BadRequestException(error.message);
      }
      this.logger.error("Check server logs", error);
      throw new InternalServerErrorException("Check server logs");
    }
  }
}
