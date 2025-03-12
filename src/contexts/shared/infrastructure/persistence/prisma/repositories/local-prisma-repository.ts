/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaClient } from "@/db/client/local";

import { AggregateRoot } from "@/contexts/shared/domain/aggregate-root";

import { environment } from "@/core/config/configuration";

import { NestLocalPrismaService } from "../services/nest-local-prisma.service";
import { PrismaMapper } from "./prisma-mapper";

export type ThenArg<V> = V extends PromiseLike<infer W> ? W : V;

export abstract class LocalPrismaRepository<
  T extends AggregateRoot,
  U extends Exclude<keyof PrismaClient, symbol | `$${string}`>,
> {
  readonly #model!: U;

  constructor(private readonly _repository: NestLocalPrismaService) {}

  protected repository(): PrismaClient[U] {
    return this._repository[this.#model];
  }

  protected async persist(
    aggregateRoot: T,
    mapper: PrismaMapper<U>,
  ): Promise<void> {
    const repository = this.repository();
    const args = mapper.toModel(aggregateRoot.toPrimitives());
    await (repository.create as any)(...args);
  }

  protected async truncate(): Promise<void> {
    if (!environment.isProduction()) {
      const repository = this.repository();
      await (repository.deleteMany as any)({});
    }
  }
}
