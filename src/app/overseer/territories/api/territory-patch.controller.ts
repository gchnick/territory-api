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
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
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
import Logger from "@/shared/domain/logger";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";

import { UpdateTerritoryCommand } from "@/contexts/Overseer/territories/application/update/update-territory-command";
import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/plain-date-value-object";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

import { TerritoryPatchRequest } from "../requests/territory-patch-request";

@ApiTags("Territory")
@Controller()
export class TerritoryPatchController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Update specific fields of a territor by ID. (Only for elders and territory servants)",
    description:
      "This endpoint only has access for the rol SERVICE_OVERSEER and TERRITORY_SERVANT",
  })
  @ApiBody({
    description: "Information to update territory",
    type: TerritoryPatchRequest,
  })
  @ApiOkResponse({
    description: "Territory was updated",
    type: MessageResponse,
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
  @Patch("/:id")
  async update(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPatchRequest,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
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
        currentAssigned,
        map,
        congregationId,
      } = body;

      const command = new UpdateTerritoryCommand({
        id,
        congregationId,
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted: lastDateCompleted
          ? PlainDateValueObject.toTemporal(lastDateCompleted)
          : undefined,
        currentAssigned,
        map,
      });

      await this.commandBus.dispatch(command);

      return reply.send(
        new MessageResponse(`Territory with id <${id}> updated successfully`),
      );
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
