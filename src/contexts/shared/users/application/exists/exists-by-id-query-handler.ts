import { ExistsResponse } from "@/shared/domain/exists-response";
import { Query } from "@/shared/domain/query";
import { QueryHandler } from "@/shared/domain/query-handler";
import { Injectable } from "@/shared/infrastructure/dependency-injection/injectable";

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
