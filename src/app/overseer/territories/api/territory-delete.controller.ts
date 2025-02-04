import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@Param("id") id: string): Promise<void> {
    const command = new DeleteTerritoryCommand(id);

    await this.commandBus.dispatch(command);
  }
}
