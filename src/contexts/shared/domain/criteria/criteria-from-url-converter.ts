import { Criteria } from "./criteria";
import { FiltersPrimitives } from "./filter";

export class CriteriaFromUrlConverter {
  public toCriteria(url: URL): Criteria {
    const searchParams = url.searchParams;
    return this.toCriteriaFrom(searchParams);
  }

  public toCriteriaFrom(searchParams: URLSearchParams) {
    const filters = this.parseFilters(searchParams);

    return Criteria.fromPrimitives(
      filters,
      searchParams.get("orderBy"),
      searchParams.get("order"),
      searchParams.has("cursor") ? searchParams.get("cursor") : undefined,
      searchParams.has("limit")
        ? Number.parseInt(searchParams.get("limit") as string, 10)
        : undefined,
    );
  }

  public toFiltersPrimitives(url: URL): FiltersPrimitives[] {
    const { searchParams } = url;

    return this.parseFilters(searchParams);
  }

  private parseFilters(searchParams: URLSearchParams): FiltersPrimitives[] {
    const tempFilters: Record<string, Partial<FiltersPrimitives>> = {};

    for (const [key, value] of searchParams.entries()) {
      const match = key.match(/filters\[(\d+)]\[(.+)]/);
      if (match) {
        const index = match[1];
        const property = match[2] as keyof FiltersPrimitives;

        if (!tempFilters[index]) {
          tempFilters[index] = {};
        }
        tempFilters[index][property] = value;
      }
    }

    return Object.values(tempFilters).filter(
      filter =>
        filter.field !== undefined &&
        filter.operator !== undefined &&
        filter.value !== undefined,
    ) as FiltersPrimitives[];
  }
}
