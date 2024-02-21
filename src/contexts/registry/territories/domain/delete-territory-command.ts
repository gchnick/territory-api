import { Command } from "@contexts/shared/domain/command";

export class DeleteTerritoryCommand extends Command {
  constructor(public id: string) {
    super();
  }
}
