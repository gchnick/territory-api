import { Query } from "@/shared/domain/query";

export class FindByNumberQuery extends Query {
  constructor(
    public congregationId: number,
    public number: number,
  ) {
    super();
  }
}
