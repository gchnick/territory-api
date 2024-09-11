import { ExistsResponse } from "@/shared/domain/exists-response";
import { Query } from "@/shared/domain/query";
import { QueryHandler } from "@/shared/domain/query-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

import { TerritoryId } from "../../domain/territory-id";
import { ExistsByIdQuery } from "./exists-by-id-query";
import { TerritoryQuestioner } from "./territory-questioner";

@Injectable()
export class ExistsByIdQueryHandler
  implements QueryHandler<ExistsByIdQuery, ExistsResponse>
{
  constructor(private readonly territoryQuestioner: TerritoryQuestioner) {}

  subscribedTo(): Query {
    return ExistsByIdQuery;
  }

  async handle(query: ExistsByIdQuery): Promise<ExistsResponse> {
    const id = new TerritoryId(query.id);
    return await this.territoryQuestioner.ask(id);
  }
}
