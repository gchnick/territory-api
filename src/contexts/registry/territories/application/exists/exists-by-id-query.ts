import { Query } from "@/contexts/shared/domain/query";

export class ExistsByIdQuery extends Query {
  constructor(public id: string) {
    super();
  }
}
