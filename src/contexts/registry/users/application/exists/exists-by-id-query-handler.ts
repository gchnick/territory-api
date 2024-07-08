import { ExistsResponse } from "@/contexts/shared/domain/exists-response";
import { Query } from "@/contexts/shared/domain/query";
import { QueryHandler } from "@/contexts/shared/domain/query-handler";
import { Injectable } from "@/contexts/shared/infrastructure/dependency-injection/injectable";

import { UserId } from "../../domain/user-id";
import { ExistsByIdQuery } from "./exists-by-id-query";
import { UserQuestioner } from "./user-questioner";

@Injectable()
export class ExistsByIdQueryHandler
  implements QueryHandler<ExistsByIdQuery, ExistsResponse>
{
  constructor(private readonly userQuestioner: UserQuestioner) {}

  subscribedTo(): Query {
    return ExistsByIdQuery;
  }

  async handle(query: ExistsByIdQuery): Promise<ExistsResponse> {
    const id = new UserId(query.id);
    return await this.userQuestioner.ask(id);
  }
}
