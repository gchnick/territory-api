import { Query } from "@/contexts/shared/domain/query";

export class SignInQuery extends Query {
  constructor(
    public email: string,
    public password: string,
  ) {
    super();
  }
}
