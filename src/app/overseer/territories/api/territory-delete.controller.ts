import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { Roles } from "@/app/shared/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/shared/auth/guards/auth.guard";
import { RolesGuard } from "@/app/shared/auth/guards/roles.guard";

import { CommandBus } from "@/shared/domain/command-bus";

import { DeleteTerritoryCommand } from "@/contexts/Overseer/territories/application/delete/delete-territory-command";
import { Role } from "@/contexts/shared/users/domain/role/role-name";

@ApiTags("Territory")
@Controller()
export class TerritoryDeleteController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a territory by id. (Only for service overseer)",
    description: "This endpoint only has access for the rol SERVICE_OVERSEER",
  })
  @ApiParam({
    name: "id",
    description: "Unique territory identifier",
    type: String,
    example: "842ae545-5194-44b0-8742-060fae82270b",
  })
  @ApiNoContentResponse({ description: "Territory was deleted" })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    const command = new DeleteTerritoryCommand(id);

    await this.commandBus.dispatch(command);
  }
}
