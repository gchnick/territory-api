/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filter } from "@/contexts/shared/domain/criteria/filter";
import { BooleanValueObject } from "@/contexts/shared/domain/value-object/boolean-value-object";

type Mappings = Record<string, string>;
type Typecaster = Record<string, (input: string) => string | number | boolean>;

export const BooleanCasting = (v: string) => BooleanValueObject.toBoolean(v);
const NoCasting = (input: string) => input;

type PrismaOptions = {
  where?: Record<string, string>;
  cursor?: any;
  take?: number;
  skip?: number;
  orderBy?: Record<string, string>;
};

export class CriteriaToPrismaConverter {
  convert(
    criteria: Criteria,
    mappings: Mappings = {},
    typecaster: Typecaster = {},
  ): PrismaOptions {
    const fieldToCursor = "id";
    const query: PrismaOptions = {};

    if (criteria.hasFilters()) {
      query.where = criteria.filters.value.reduce((acc, filter) => {
        return {
          ...acc,
          ...this.#generateWhereQuery(filter, mappings, typecaster),
        };
      }, {});
    }

    if (criteria.cursor && criteria.limit) {
      const field = mappings[fieldToCursor] || fieldToCursor;
      query.cursor = { [field]: criteria.cursor };
      query.skip = 1;
    }

    if (criteria.hasOrder()) {
      const field =
        mappings[criteria.order.orderBy.value] || criteria.order.orderBy.value;
      const order = criteria.order.orderType.isAsc() ? "asc" : "desc";
      query.orderBy = { [field]: order };
    }

    if (criteria.limit) {
      query.take = criteria.limit;
    }

    return query;
  }

  #generateWhereQuery(
    filter: Filter,
    mappings: Mappings = {},
    typecaster: Typecaster = {},
  ) {
    const field = mappings[filter.field.value] || filter.field.value;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const typecasting = typecaster[filter.field.value] || NoCasting;
    const value = typecasting(filter.value.value);

    if (filter.operator.isContains()) {
      return { [field]: { contains: value } };
    } else if (filter.operator.isNotContains()) {
      return {
        NOT: [{ [field]: { contains: value } }],
      };
    } else if (filter.operator.isNotEquals()) {
      return {
        NOT: [{ [field]: value }],
      };
    } else if (filter.operator.isGreaterThan()) {
      return { [field]: { gt: value } };
    } else if (filter.operator.isGreaterThanOrEqual()) {
      return { [field]: { gte: value } };
    } else if (filter.operator.isLowerThan()) {
      return { [field]: { lt: value } };
    } else if (filter.operator.isLowerThanOrEqual()) {
      return { [field]: { lte: value } };
    }

    return { [field]: value };
  }
}
