import { Global, Module } from "@nestjs/common";

import { TerritoryModule } from "@/app/territories/territory.module";
import { UserModule } from "@/app/user/user.module";

import { Command } from "@/contexts/shared/domain/command";
import { CommandBus } from "@/contexts/shared/domain/command-bus";
import { CommandHandler } from "@/contexts/shared/domain/command-handler";
import { CommandHandlers } from "@/contexts/shared/infrastructure/command-bus/command-handlers";
import { InMemoryCommandBus } from "@/contexts/shared/infrastructure/command-bus/in-memory-command-bus";

@Global()
@Module({
  imports: [UserModule, TerritoryModule],
  providers: [
    {
      provide: CommandHandlers,
      useFactory: (
        user: Array<CommandHandler<Command>>,
        territory: Array<CommandHandler<Command>>,
      ) => new CommandHandlers([...user, ...territory]),
      inject: ["UserCommandHandlers", "TerritoryCommandHandlers"],
    },
    {
      provide: CommandBus,
      useFactory: (c: CommandHandlers) => new InMemoryCommandBus(c),
      inject: [CommandHandlers],
    },
  ],
  exports: [CommandBus],
})
export class CommandModule {}
