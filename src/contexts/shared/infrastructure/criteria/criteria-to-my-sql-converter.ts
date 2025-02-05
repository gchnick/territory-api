import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { Filter } from "@/contexts/shared/domain/criteria/filter";

type Mappings = { [key: string]: string };

export class CriteriaToMySqlConverter {
  convert(
    fieldsToSelect: string[],
    tableName: string,
    criteria: Criteria,
    mappings: Mappings = {},
  ): { query: string; params: (string | number)[] } {
    let query = `SELECT ${fieldsToSelect.join(", ")} FROM ${tableName}`;
    const fieldToCursor: string = "id";
    const params: (string | number)[] = [];

    if (criteria.hasFilters()) {
      query += " WHERE ";

      const whereQueries = criteria.filters.value.map(filter =>
        this.#generateWhereQuery(filter, mappings, params),
      );

      query += whereQueries.join(" AND ");
    }

    if (criteria.cursor && criteria.limit) {
      query += criteria.hasFilters() ? " AND " : " WHERE ";

      query += this.#generateCursorQuery(
        criteria.cursor,
        fieldToCursor,
        mappings,
        params,
      );
    }

    if (criteria.hasOrder()) {
      query += " ORDER BY ? ?";

      params.push(criteria.order.orderBy.value, criteria.order.orderType.value);
    }

    if (criteria.limit) {
      query += " LIMIT ?";

      params.push(criteria.limit);
    }

    return { query: `${query};`, params };
  }

  #generateWhereQuery(
    filter: Filter,
    mappings: Mappings = {},
    params: (string | number)[],
  ): string {
    const field = mappings[filter.field.value] || filter.field.value;

    let queryPart = `${field} `;
    const value = filter.value.value;

    if (filter.operator.isContains()) {
      queryPart += "LIKE ?";
      params.push(`%${value}%`);
    } else if (filter.operator.isNotContains()) {
      queryPart += "NOT LIKE ?";
      params.push(`%${value}%`);
    } else if (filter.operator.isNotEquals()) {
      queryPart += "!= ?";
      params.push(value);
    } else if (filter.operator.isGreaterThan()) {
      queryPart += "> ?";
      params.push(value);
    } else if (filter.operator.isGreaterThanOrEqual()) {
      queryPart += ">= ?";
      params.push(value);
    } else if (filter.operator.isLowerThan()) {
      queryPart += "< ?";
      params.push(value);
    } else if (filter.operator.isLowerThanOrEqual()) {
      queryPart += "<= ?";
      params.push(value);
    } else {
      queryPart += `${filter.operator.value} ?`;
      params.push(value);
    }

    return queryPart;
  }

  #generateCursorQuery(
    cursor: string,
    fieldToCursor: string,
    mappings: Mappings = {},
    params: (string | number)[],
  ) {
    const field = mappings[fieldToCursor] || fieldToCursor;

    let queryPart = `${field} `;

    queryPart += "> ?";
    params.push(cursor);

    return queryPart;
  }
}
