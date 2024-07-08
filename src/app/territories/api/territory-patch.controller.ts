/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Response,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FastifyReply } from "fastify";

import { UpdateTerritoryCommand } from "@/contexts/registry/territories/application/update/update-territory-command";
import { CommandBus } from "@/contexts/shared/domain/command-bus";
import Logger from "@/contexts/shared/domain/logger";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

import { TerritoryPatchRequest } from "../requests/territory-patch-request";

@ApiTags("Territory")
@Controller()
export class TerritoryPatchController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SERVICE_OVERSEER)
  @HttpCode(HttpStatus.OK)
  @Patch("/:id")
  async update(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPatchRequest,
    @Response() reply: FastifyReply,
    @Param("id", ParseUUIDPipe) id: string,
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
        isLocked,
      } = body;

      const command = new UpdateTerritoryCommand({
        id,
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted: lastDateCompleted
          ? new Date(lastDateCompleted)
          : undefined,
        isLocked,
      });

      await this.commandBus.dispatch(command);

      await reply.send({
        message: `Territory with id <${id}> updated successfully`,
      });
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
