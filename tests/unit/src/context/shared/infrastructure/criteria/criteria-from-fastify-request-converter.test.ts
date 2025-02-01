import assert from "node:assert";

import Fastify from "fastify";

import { CriteriaMother } from "@/tests/unit/src/context/shared/domain/criteria/criteria-mother";

import { CriteriaFromFastifyRequestConverter } from "@/contexts/shared/infrastructure/criteria/criteria-from-fastify-request-converter";

describe("CriteriaFromNextRequestConverter should", () => {
  const converter = new CriteriaFromFastifyRequestConverter();

  it("Converts a url with one filter", () => {
    const url = new URL(
      "http://localhost:3000/api/users?filters[0][field]=name&filters[0][operator]=CONTAINS&filters[0][value]=Niko",
    );

    const expectedCriteria = CriteriaMother.withOneFilter(
      "name",
      "CONTAINS",
      "Niko",
    );

    const fastify = Fastify();
    fastify.get(url.toString(), request => {
      assert.deepEqual(converter.toCriteria(request), expectedCriteria);
    });
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

    const fastify = Fastify();
    fastify.get(url.toString(), request => {
      assert.deepEqual(converter.toCriteria(request), expectedCriteria);
    });
  });

  it("Converts a url with multiple filters order and cursor", () => {
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

    const fastify = Fastify();
    fastify.get(url.toString(), request => {
      assert.deepEqual(converter.toCriteria(request), expectedCriteria);
    });
  });
});
