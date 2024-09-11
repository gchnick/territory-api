import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CommandBus } from "@/shared/domain/command-bus";
import Logger from "@/shared/domain/logger";
import { InvalidArgumentError } from "@/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@/shared/domain/value-object/uuid";

import { CreateTerritoryCommand } from "@/contexts/Overseer/territories/application/create/create-territory-command";

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
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
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

      return response.headers.set("location", `${request.url}/${command.id}`);
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
