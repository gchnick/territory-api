import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
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

import { TerritoryPutRequest } from "@/app/overseer/territories/requests/territory-put-request";
import { Roles } from "@/app/shared/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/shared/auth/guards/auth.guard";
import { RolesGuard } from "@/app/shared/auth/guards/roles.guard";
import { MessageResponse } from "@/app/shared/responses/message-response";

import { CommandBus } from "@/shared/domain/command-bus";
import { ExistsResponse } from "@/shared/domain/exists-response";
import Logger from "@/shared/domain/logger";
import { QueryBus } from "@/shared/domain/query-bus";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";
import { ExistsByIdQuery } from "@/contexts/Overseer/territories/application/exists/exists-by-id-query";
import { UpdateTerritoryCommand } from "@/contexts/Overseer/territories/application/update/update-territory-command";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

@ApiTags("Territory")
@Controller()
export class TerritoryPutController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Update or create a territor by ID. (Only for elders and territory servants)",
    description:
      "This endpoint only has access for the rol SERVICE_OVERSEER and TERRITORY_SERVANT",
  })
  @ApiBody({
    description: "Information to update or create territory",
    type: TerritoryPutRequest,
  })
  @ApiOkResponse({
    description: "Territory was updated",
    type: MessageResponse,
  })
  @ApiCreatedResponse({
    description:
      "Territory created successfully. The URL of the resource is located in the 'Location' header.",
    headers: {
      Location: {
        description: "URL of the created resource",
        schema: { type: "string" },
      },
    },
  })
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
    description: "Unique territory identifier",
    type: String,
    example: "842ae545-5194-44b0-8742-060fae82270b",
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER, Role.TERRITORY_SERVANT)
  @HttpCode(HttpStatus.OK)
  @Put("/:id")
  async update(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPutRequest,
    @Req() request: Request,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    try {
      const {
        congregationId,
        currentAssigned,
        label,
        locality,
        localityInPart,
        number,
        map,
        lastDateCompleted,
        quantityHouses,
        sector,
      } = body;

      const query = new ExistsByIdQuery(id);
      const { exists } = await this.queryBus.ask<ExistsResponse>(query);

      if (exists) {
        const command = new UpdateTerritoryCommand({
          currentAssigned,
          congregationId,
          id,
          label,
          lastDateCompleted: lastDateCompleted
            ? new Date(lastDateCompleted)
            : undefined,
          locality,
          localityInPart,
          number,
          map,
          quantityHouses,
          sector,
        });

        await this.commandBus.dispatch(command);

        return reply.send(
          new MessageResponse(`Territory with id <${id}> updated successfully`),
        );
      }

      if (
        !label ||
        !lastDateCompleted ||
        !locality ||
        !number ||
        !quantityHouses
      ) {
        throw new InvalidArgumentError(
          "In order to create a new territory the fields are required",
        );
      }

      const command = new CreateTerritoryCommand({
        congregationId,
        id,
        label,
        lastDateCompleted: new Date(lastDateCompleted),
        locality,
        localityInPart,
        number,
        map,
        quantityHouses,
        sector,
      });

      await this.commandBus.dispatch(command);

      return reply.header("location", request.url).status(201).send();
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
