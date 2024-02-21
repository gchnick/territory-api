import { Connection, EntitySchema, Repository } from "typeorm";

import { AggregateRoot } from "@contexts/shared/domain/aggregate-root";

export abstract class TypeOrmRepository<T extends AggregateRoot> {
  constructor(private _client: Promise<Connection>) {}

  protected abstract entitySchema(): EntitySchema<T>;

  protected client(): Promise<Connection> {
    return this._client;
  }

  protected async repository(): Promise<Repository<T>> {
    // eslint-disable-next-line unicorn/no-await-expression-member
    return (await this._client).getRepository(this.entitySchema());
  }

  protected async persist(aggregateRoot: T): Promise<void> {
    const repository = await this.repository();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await repository.save(aggregateRoot as any);
  }
}
