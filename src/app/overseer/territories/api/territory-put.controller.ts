import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TerritoryPutRequest } from "@/src/app/overseer/territories/requests/territory-put-request";

import { CommandBus } from "@/shared/domain/command-bus";
import { ExistsResponse } from "@/shared/domain/exists-response";
import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";
import { ExistsByIdQuery } from "@/contexts/Overseer/territories/application/exists/exists-by-id-query";
import { UpdateTerritoryCommand } from "@/contexts/Overseer/territories/application/update/update-territory-command";

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
    @Req() request: Request,
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

        return Response.json(
          { message: `Territory with id <${id}> updated successfully` },
          { status: HttpStatus.OK },
        );
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

      return Response.json(undefined, {
        status: HttpStatus.CREATED,
        headers: { location: `${request.url}/${command.id}` },
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
