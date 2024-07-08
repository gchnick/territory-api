import { Command } from "@/contexts/shared/domain/command";
import { CommandBus } from "@/contexts/shared/domain/command-bus";

export class MockCommandBus implements CommandBus {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch(_: Command): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
