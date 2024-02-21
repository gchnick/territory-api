import { Filter, FilterPrimitives } from "./filter";

export class Filters {
  readonly filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  static fromValues(filters: Array<Map<string, string>>): Filters {
    return new Filters(filters.map(element => Filter.fromValues(element)));
  }

  static none(): Filters {
    return new Filters([]);
  }

  static fromPrimitives(filters: FilterPrimitives[]): Filters {
    return new Filters(
      filters.map(({ field, operator, value }) =>
        Filter.fromPrimitives(field, operator, value),
      ),
    );
  }

  toPrimitives(): FilterPrimitives[] {
    return this.filters.map(filter => filter.toPrimitives());
  }
}
