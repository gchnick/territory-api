import { Query } from '@shared/domain/query';

export class FindByEmailQuery extends Query {
  constructor(public email: string) {
    super();
  }
}
