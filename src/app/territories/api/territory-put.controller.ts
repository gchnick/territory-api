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
import { ApiTags } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";

import { TerritoryPutRequest } from "@/app/territories/requests/territory-put-request";

import { CreateTerritoryCommand } from "@/contexts/registry/territories/application/create/create-territory-command";
import { ExistsByIdQuery } from "@/contexts/registry/territories/application/exists/exists-by-id-query";
import { UpdateTerritoryCommand } from "@/contexts/registry/territories/application/update/update-territory-command";
import { CommandBus } from "@/contexts/shared/domain/command-bus";
import { ExistsResponse } from "@/contexts/shared/domain/exists-response";
import Logger from "@/contexts/shared/domain/logger";
import { QueryBus } from "@/contexts/shared/domain/query-bus";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

@ApiTags("Territory")
@Controller()
export class TerritoryPutController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SERVICE_OVERSEER)
  @Put("/:id")
  async update(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPutRequest,
    @Request() request: FastifyRequest,
    @Response({ passthrough: true }) reply: FastifyReply,
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

      const query = new ExistsByIdQuery(id);
      const { exists } = await this.queryBus.ask<ExistsResponse>(query);

      if (exists) {
        const command = new UpdateTerritoryCommand({
          id,
          number,
          label,
          sector,
          locality,
          localityInPart,
          quantityHouses,
          lastDateCompleted: new Date(lastDateCompleted),
          isLocked,
        });

        await this.commandBus.dispatch(command);

        return await reply
          .status(HttpStatus.OK)
          .send({ message: `Territory with id <${id}> updated successfully` });
      }

      const command = new CreateTerritoryCommand({
        id,
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted: new Date(lastDateCompleted),
      });

      await this.commandBus.dispatch(command);

      await reply
        .header("location", `${request.url}/${command.id}`)
        .status(HttpStatus.CREATED)
        .send();
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
