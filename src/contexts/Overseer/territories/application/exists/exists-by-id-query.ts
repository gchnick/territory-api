import { Query } from "@/shared/domain/query";

export class ExistsByIdQuery extends Query {
  constructor(public id: string) {
    super();
  }
}
