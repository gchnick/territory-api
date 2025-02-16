/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EnvironmentVariables } from "@/core/config/configuration";

import { ConfigService } from "@nestjs/config";
import { DataSource, EntitySchema, Repository } from "typeorm";

import { AggregateRoot } from "@/shared/domain/aggregate-root";

import { Environment } from "@/contexts/shared/domain/value-object/environment";

export abstract class TypeOrmRepository<T extends AggregateRoot> {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _configService: ConfigService<EnvironmentVariables>,
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
    const environment = Environment.fromValue(nodeEnv);

    if (environment.isDevelopment() || environment.isTest()) {
      const repository = this.repository();
      await repository.clear();
    }
  }
}
