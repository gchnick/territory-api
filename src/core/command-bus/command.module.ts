import { Global, Module } from "@nestjs/common";

import { TerritoryModule } from "@/src/app/overseer/territories/territory.module";
import { UserModule } from "@/src/app/shared/user/user.module";

import { Command } from "@/shared/domain/command";
import { CommandBus } from "@/shared/domain/command-bus";
import { CommandHandler } from "@/shared/domain/command-handler";
import { CommandHandlers } from "@/shared/infrastructure/command-bus/command-handlers";
import { InMemoryCommandBus } from "@/shared/infrastructure/command-bus/in-memory-command-bus";

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
