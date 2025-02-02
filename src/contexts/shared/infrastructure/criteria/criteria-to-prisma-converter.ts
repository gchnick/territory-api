/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filter } from "@/contexts/shared/domain/criteria/filter";

type Mappings = { [key: string]: string };

type PrismaOptions = {
  select?: { [key: string]: boolean };
  where?: { [key: string]: string };
  cursor?: any;
  take?: number;
  skip?: number;
  orderBy?: { [key: string]: string };
};

export class CriteriaToPrismaConverter {
  convert(
    fieldsToSelect: string[],
    criteria: Criteria,
    mappings: Mappings = {},
  ): PrismaOptions {
    const fieldToCursor: string = "id";
    const query: PrismaOptions = {};

    query.select = fieldsToSelect.reduce((acc, field) => {
      return { ...acc, ...this.#generateSelectQuery(field, mappings) };
    }, {});

    if (criteria.hasFilters()) {
      query.where = criteria.filters.value.reduce((acc, filter) => {
        return { ...acc, ...this.#generateWhereQuery(filter, mappings) };
      }, {});
    }

    if (criteria.cursor && criteria.limit) {
      const field = mappings[fieldToCursor] || fieldToCursor;
      query.cursor = { [field]: criteria.cursor };
      query.skip = 1;
    }

    if (criteria.hasOrder()) {
      const field = criteria.order.orderBy.value;
      const order = criteria.order.orderType.isAsc() ? "asc" : "desc";
      query.orderBy = { [field]: order };
    }

    if (criteria.limit) {
      query.take = criteria.limit;
    }

    return query;
  }

  #generateSelectQuery(fieldToSelect: string, mappings: Mappings = {}) {
    const field = mappings[fieldToSelect] || fieldToSelect;
    const value = true;

    return { [field]: value };
  }

  #generateWhereQuery(filter: Filter, mappings: Mappings = {}) {
    const field = mappings[filter.field.value] || filter.field.value;
    const value = filter.value.value;

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
