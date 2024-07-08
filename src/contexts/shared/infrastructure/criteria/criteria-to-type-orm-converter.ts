/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Like, Not } from "typeorm";

import { Criteria } from "../../domain/criteria/criteria";
import { Filter } from "../../domain/criteria/filter";

type Mappings = { [key: string]: string };

type TypeOrmOptions = {
  order?: { [key: string]: string };
  where?: { [key: string]: string };
  // cursor?: string; TODO: Implement
};

export class CriteriaToTypeOrmConverter {
  convert(criteria: Criteria, mappings: Mappings = {}): TypeOrmOptions {
    const query: TypeOrmOptions = {};

    if (criteria.hasFilters()) {
      query.where = criteria.filters.value.reduce((acc, filter) => {
        return { ...acc, ...this.generateWhereQuery(filter, mappings) };
      }, {});
    }

    if (criteria.hasOrder()) {
      query.order = {
        [criteria.order.orderBy.value]: criteria.order.orderType.value,
      };
    }

    // if (criteria.cursor !== null) { TODO: Implement
    //   query.cursor = criteria.cursor;
    // }

    return query;
  }

  private generateWhereQuery(filter: Filter, mappings: Mappings = {}) {
    const field = mappings[filter.field.value] || filter.field.value;

    if (filter.operator.isContains()) {
      return { [field]: Like(filter.value.value) };
    }

    if (filter.operator.isNotContains()) {
      return { [field]: Not(Like(filter.value.value)) };
    }

    if (filter.operator.isNotEquals()) {
      return { [field]: Not(filter.value.value) };
    }

    return { [field]: filter.value.value };
  }
}
