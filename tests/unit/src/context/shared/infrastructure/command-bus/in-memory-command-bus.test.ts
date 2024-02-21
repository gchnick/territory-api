/* eslint-disable jest/no-mocks-import */
import { CommandNotRegisteredError } from "@contexts/shared/domain/command-not-registered-error";
import { CommandHandlers } from "@contexts/shared/infrastructure/command-bus/command-handlers";
import { InMemoryCommandBus } from "@contexts/shared/infrastructure/command-bus/in-memory-command-bus";

import { CommandHandlerDummy } from "./__mocks__/command-handler-dummy";
import { DummyCommand } from "./__mocks__/dummy-command";
import { UnhandledCommand } from "./__mocks__/unhandled-command";

describe("InMemoryCommandBus should", () => {
  it("throws an error if dispatches a command without handler", async () => {
    const unhandledCommand = new UnhandledCommand();
    const commandHandlers = new CommandHandlers([]);
    const commandBus = new InMemoryCommandBus(commandHandlers);

    await expect(commandBus.dispatch(unhandledCommand)).rejects.toBeInstanceOf(
      CommandNotRegisteredError,
    );
  });

  it("accepts a command with handler", async () => {
    const dummyCommand = new DummyCommand();
    const commandHandlerDummy = new CommandHandlerDummy();
    const commandHandlers = new CommandHandlers([commandHandlerDummy]);
    const commandBus = new InMemoryCommandBus(commandHandlers);

    await commandBus.dispatch(dummyCommand);
  });
});
