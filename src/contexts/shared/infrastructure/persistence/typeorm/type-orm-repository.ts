/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, EntitySchema, Repository } from "typeorm";

import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";

export abstract class TypeOrmRepository<T extends AggregateRoot> {
  constructor(private _dataSource: DataSource) {}

  protected abstract entitySchema(): EntitySchema<T>;

  protected dataSource(): DataSource {
    return this._dataSource;
  }

  protected repository(): Repository<T> {
    return this._dataSource.getRepository(this.entitySchema());
  }

  protected async persist(aggregateRoot: T): Promise<void> {
    const repository = this.repository();
    await repository.save(aggregateRoot as any);
  }

  protected async truncate(): Promise<void> {
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV === "development" || NODE_ENV === "test") {
      const repository = this.repository();
      await repository.clear();
    }
  }
}
