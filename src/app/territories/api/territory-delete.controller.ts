import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Roles } from "@/app/auth/decorators/roles.decorator";
import { AuthGuard } from "@/app/auth/guards/auth.guard";
import { RolesGuard } from "@/app/auth/guards/roles.guard";

import { DeleteTerritoryCommand } from "@/contexts/registry/territories/application/delete/delete-territory-command";
import { Role } from "@/contexts/registry/users/domain/role/role-name";
import { CommandBus } from "@/contexts/shared/domain/command-bus";

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
