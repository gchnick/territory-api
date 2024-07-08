import { FilterPrimitives } from "../../domain/criteria/filter";

export const SearchParamsCriteriaFiltersParser = {
  parse(searchParams: URLSearchParams): FilterPrimitives[] {
    const tempFilters: Record<string, Partial<FilterPrimitives>> = {};

    for (const [key, value] of searchParams.entries()) {
      const match = key.match(/filters\[(\d+)]\[(.+)]/);
      if (match) {
        const index = match[1];
        const property = match[2] as keyof FilterPrimitives;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    ) as FilterPrimitives[];
  },
};
