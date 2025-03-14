import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Response,
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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import * as fastify from "fastify";

import { Roles } from "@/app/shared/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/shared/auth/guards/auth.guard";
import { RolesGuard } from "@/app/shared/auth/guards/roles.guard";

import { CommandBus } from "@/shared/domain/command-bus";
import Logger from "@/shared/domain/logger";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@/shared/domain/value-object/uuid";

import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";
import { PlainDateValueObject } from "@/contexts/shared/domain/value-object/plain-date-value-object";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

import { TerritoryPostRequest } from "../requests/territory-post-request";

@ApiTags("Territory")
@Controller()
export class TerritoryPostController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create new territory. (Only for elders and territory servants)",
    description:
      "This endpoint only has access for the rol SERVICE_OVERSEER and TERRITORY_SERVANT",
  })
  @ApiBody({
    description: "Information for creating a new territory",
    type: TerritoryPostRequest,
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) body: TerritoryPostRequest,
    @Req() request: Request,
    @Response({ passthrough: true }) reply: fastify.FastifyReply,
  ) {
    try {
      const {
        number,
        congregationId,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted,
      } = body;

      const command = new CreateTerritoryCommand({
        id: Uuid.random().value,
        congregationId,
        number,
        label,
        sector,
        locality,
        localityInPart,
        quantityHouses,
        lastDateCompleted: PlainDateValueObject.toTemporal(lastDateCompleted),
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
