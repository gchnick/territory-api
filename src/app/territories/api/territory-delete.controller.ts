import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from "@nestjs/common";

import { Roles } from "@app/auth/decorators/roles.decorator";
import { AuthGuard } from "@app/auth/guards/auth.guard";
import { RolesGuard } from "@app/auth/guards/roles.guard";

import { DeleteTerritoryCommand } from "@contexts/registry/territories/domain/delete-territory-command";
import { Role } from "@contexts/registry/users/domain/user-role";
import { CommandBus } from "@contexts/shared/domain/command-bus";

@Controller()
export class TerritoryDeleteController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SERVICE_OVERSEER)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    const command = new DeleteTerritoryCommand(id);

    await this.commandBus.dispatch(command);
  }
}
