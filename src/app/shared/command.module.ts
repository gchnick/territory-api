import { Global, Module, Provider } from "@nestjs/common";

import { CommandBus } from "@contexts/shared/domain/command-bus";
import { CommandHandlers } from "@contexts/shared/infrastructure/command-bus/command-handlers";
import { InMemoryCommandBus } from "@contexts/shared/infrastructure/command-bus/in-memory-command-bus";

const commandProvider: Provider[] = [
  { provide: CommandHandlers, useFactory: () => new CommandHandlers([]) },
  {
    provide: CommandBus,
    useFactory: (c: CommandHandlers) => new InMemoryCommandBus(c),
    inject: [CommandHandlers],
  },
];

@Global()
@Module({
  providers: [...commandProvider],
  exports: [...commandProvider],
})
export class CommandModule {}
