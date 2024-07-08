import { Command } from "@/contexts/shared/domain/command";

export class DummyCommand extends Command {
  static COMMAND_NAME = "handled.command";
}
