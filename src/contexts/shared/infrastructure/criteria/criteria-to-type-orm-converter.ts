import {
  FindOperator,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from "typeorm";

import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filter } from "@/contexts/shared/domain/criteria/filter";

type Mappings = { [key: string]: string };

type TypeOrmOptions = {
  order?: { [key: string]: string };
  where?: { [key: string]: FindOperator<string> };
};

export class CriteriaToTypeOrmConverter {
  convert(criteria: Criteria, mappings: Mappings = {}): TypeOrmOptions {
    const fieldToCursor = "id";
    const query: TypeOrmOptions = {};

    if (criteria.hasFilters()) {
      // eslint-disable-next-line unicorn/no-array-reduce
      query.where = criteria.filters.value.reduce((acc, filter) => {
        return { ...acc, ...this.#generateWhereQuery(filter, mappings) };
      }, {});
    }

    if (criteria.hasOrder()) {
      query.order = {
        [criteria.order.orderBy.value]: criteria.order.orderType.value,
      };
    }

    if (criteria.cursor && criteria.limit) {
      const field = mappings[fieldToCursor] || fieldToCursor;
      const cursorQuery = { [field]: MoreThan(criteria.cursor) };
      query.where = { ...query.where, ...cursorQuery };
    }

    return query;
  }

  #generateWhereQuery(filter: Filter, mappings: Mappings = {}) {
    const field = mappings[filter.field.value] || filter.field.value;
    const value = filter.value.value;

    if (filter.operator.isContains()) {
      return { [field]: Like(value) };
    } else if (filter.operator.isNotContains()) {
      return { [field]: Not(Like(value)) };
    } else if (filter.operator.isNotEquals()) {
      return { [field]: Not(value) };
    } else if (filter.operator.isGreaterThan()) {
      return { [field]: MoreThan(value) };
    } else if (filter.operator.isGreaterThanOrEqual()) {
      return { [field]: MoreThanOrEqual(value) };
    } else if (filter.operator.isLowerThan()) {
      return { [field]: LessThan(value) };
    } else if (filter.operator.isLowerThanOrEqual()) {
      return { [field]: LessThanOrEqual(value) };
    }

    return { [field]: value };
  }
}
