import { Filter, FiltersPrimitives } from "./filter";

export class Filters {
  readonly value: Filter[];

  constructor(filters: Filter[]) {
    this.value = filters;
  }

  static fromPrimitives(filters: FiltersPrimitives[]): Filters {
    return new Filters(
      filters.map(({ field, operator, value }) =>
        Filter.fromPrimitives(field, operator, value),
      ),
    );
  }

  static fromValues(filters: Map<string, string>[]): Filters {
    return new Filters(filters.map(element => Filter.fromValues(element)));
  }

  static none(): Filters {
    return new Filters([]);
  }

  toPrimitives(): FiltersPrimitives[] {
    return this.value.map(filter => filter.toPrimitives());
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }
}
