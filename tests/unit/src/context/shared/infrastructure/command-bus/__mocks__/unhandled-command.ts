import { Command } from "@/contexts/shared/domain/command";

export class UnhandledCommand extends Command {
  static COMMAND_NAME = "unhandled.command";
}
