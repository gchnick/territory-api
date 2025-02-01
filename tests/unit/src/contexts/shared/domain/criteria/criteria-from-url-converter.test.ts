import assert from "node:assert";

import { CriteriaFromUrlConverter } from "@/contexts/shared/domain/criteria/criteria-from-url-converter";

import { CriteriaMother } from "./criteria-mother";

describe("CriteriaFromUrlConverter should", () => {
  const converter = new CriteriaFromUrlConverter();

  it("Converts a url with one filter", () => {
    const url = new URL(
      "http://localhost:3000/api/users" +
        "?filters[0][field]=name&filters[0][operator]=CONTAINS&filters[0][value]=Niko",
    );

    const expectedCriteria = CriteriaMother.withOneFilter(
      "name",
      "CONTAINS",
      "Niko",
    );

    assert.deepEqual(converter.toCriteria(url), expectedCriteria);
  });

  it("Converts a url with multiple filters", () => {
    const url = new URL(
      "http://localhost:3000/api/users" +
        "?filters[0][field]=name&filters[0][operator]=CONTAINS&filters[0][value]=Niko" +
        "&filters[1][field]=email&filters[1][operator]=CONTAINS&filters[1][value]=gmail",
    );

    const expectedCriteria = CriteriaMother.create({
      filters: [
        {
          field: "name",
          operator: "CONTAINS",
          value: "Niko",
        },
        {
          field: "email",
          operator: "CONTAINS",
          value: "gmail",
        },
      ],
      orderBy: undefined,
      orderType: undefined,
      cursor: undefined,
      limit: undefined,
    });

    assert.deepEqual(converter.toCriteria(url), expectedCriteria);
  });

  it("Converts a url with multiple filters order and pagination", () => {
    const url = new URL(
      "http://localhost:3000/api/users" +
        "?filters[0][field]=name&filters[0][operator]=CONTAINS&filters[0][value]=Niko" +
        "&filters[1][field]=email&filters[1][operator]=CONTAINS&filters[1][value]=gmail" +
        "&orderBy=name&order=ASC" +
        "&cursor=2&limit=10",
    );

    const expectedCriteria = CriteriaMother.create({
      filters: [
        {
          field: "name",
          operator: "CONTAINS",
          value: "Niko",
        },
        {
          field: "email",
          operator: "CONTAINS",
          value: "gmail",
        },
      ],
      orderBy: "name",
      orderType: "ASC",
      cursor: "2",
      limit: 10,
    });

    assert.deepEqual(converter.toCriteria(url), expectedCriteria);
  });
});
