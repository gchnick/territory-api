import * as fastify from "fastify";

import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { CriteriaFromUrlConverter } from "@/contexts/shared/domain/criteria/criteria-from-url-converter";
import { FiltersPrimitives } from "@/contexts/shared/domain/criteria/filter";

export class CriteriaFromFastifyRequestConverter {
  readonly #urlConverter: CriteriaFromUrlConverter;

  constructor() {
    this.#urlConverter = new CriteriaFromUrlConverter();
  }

  public toCriteria(request: fastify.FastifyRequest): Criteria {
    // const [, querystring] = request.url.split("?");
    // const query = new URLSearchParams(querystring);
    const url = new URL(request.url);

    return this.#urlConverter.toCriteria(url);
  }

  public toFiltersPrimitives(
    request: fastify.FastifyRequest,
  ): FiltersPrimitives[] {
    const url = new URL(request.url);

    return this.#urlConverter.toFiltersPrimitives(url);
  }
}
