import { Query } from '@shared/domain/query';

export class FindByNumberQuery extends Query {
  constructor(public number: number) {
    super();
  }
}
