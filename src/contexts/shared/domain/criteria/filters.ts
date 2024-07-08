import { Filter, FilterPrimitives } from "./filter";

export class Filters {
  readonly value: Filter[];

  constructor(filters: Filter[]) {
    this.value = filters;
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
    return this.value.map(filter => filter.toPrimitives());
  }
}
