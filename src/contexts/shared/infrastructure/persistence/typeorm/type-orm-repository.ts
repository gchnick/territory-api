/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from "@nestjs/config";
import { DataSource, EntitySchema, Repository } from "typeorm";

import { AggregateRoot } from "@/shared/domain/aggregate-root";

import { EnviromentValueObject } from "@/contexts/shared/domain/value-object/enviroment-value-object";

export abstract class TypeOrmRepository<T extends AggregateRoot> {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _configService: ConfigService,
  ) {}

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
    const nodeEnv = this._configService.getOrThrow<string>("NODE_ENV");
    const environment = EnviromentValueObject.fromValue(nodeEnv);

    if (environment.isDevelopment() || environment.isTest()) {
      const repository = this.repository();
      await repository.clear();
    }
  }
}
