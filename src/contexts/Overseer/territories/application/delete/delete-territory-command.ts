import { Command } from "@/shared/domain/command";

export class DeleteTerritoryCommand extends Command {
  constructor(public id: string) {
    super();
  }
}
