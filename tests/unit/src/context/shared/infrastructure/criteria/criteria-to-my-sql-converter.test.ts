import assert from "node:assert";

import { CriteriaMother } from "@/tests/unit/src/context/shared/domain/criteria/criteria-mother";

import { CriteriaToMySqlConverter } from "@/contexts/shared/infrastructure/criteria/criteria-to-my-sql-converter";

describe("CriteriaToMySqlConverter should", () => {
  const converter = new CriteriaToMySqlConverter();

  it("Generate simple select with an empty criteria", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.empty(),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users;",
      params: [],
    });
  });

  it("Generate select with order", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.emptySorted("id", "DESC"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users ORDER BY ? ?;",
      params: ["id", "DESC"],
    });
  });

  it("Generate select with one filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "EQUAL", "Nick"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name = ?;",
      params: ["Nick"],
    });
  });

  it("Generate select with one greater than filter", () => {
    const actualQuery = converter.convert(
      ["id", "age"],
      "users",
      CriteriaMother.withOneFilter("age", "GREATER_THAN", "25"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, age FROM users WHERE age > ?;",
      params: [25],
    });
  });

  it("Generate select with one greater than or equal filter", () => {
    const actualQuery = converter.convert(
      ["id", "age"],
      "users",
      CriteriaMother.withOneFilter("age", "GREATER_THAN_OR_EQUAL", "25"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, age FROM users WHERE age >= ?;",
      params: [25],
    });
  });

  it("Generate select with one lower than filter", () => {
    const actualQuery = converter.convert(
      ["id", "age"],
      "users",
      CriteriaMother.withOneFilter("age", "LOWER_THAN", "18"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, age FROM users WHERE age < ?;",
      params: [18],
    });
  });

  it("Generate select with one lower than or equal filter", () => {
    const actualQuery = converter.convert(
      ["id", "age"],
      "users",
      CriteriaMother.withOneFilter("age", "LOWER_THAN_OR_EQUAL", "18"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, age FROM users WHERE age <= ?;",
      params: [18],
    });
  });

  it("Generate select with one filter sorted", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilterSorted("name", "EQUAL", "Nick", "id", "DESC"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name = ? ORDER BY ? ?;",
      params: ["Nick", "id", "DESC"],
    });
  });

  it("Generate select with multiples filters", () => {
    const actualQuery = converter.convert(
      ["id", "name", "email"],
      "users",
      CriteriaMother.create({
        filters: [
          {
            field: "name",
            operator: "EQUAL",
            value: "Nick",
          },
          {
            field: "email",
            operator: "EQUAL",
            value: "nick@mail.com",
          },
        ],
        orderBy: undefined,
        orderType: undefined,
        cursor: undefined,
        limit: undefined,
      }),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name, email FROM users WHERE name = ? AND email = ?;",
      params: ["Nick", "nick@mail.com"],
    });
  });

  it("Generate select with multiples filters and sort", () => {
    const actualQuery = converter.convert(
      ["id", "name", "email"],
      "users",
      CriteriaMother.create({
        filters: [
          {
            field: "name",
            operator: "EQUAL",
            value: "Nick",
          },
          {
            field: "email",
            operator: "EQUAL",
            value: "nick@mail.com",
          },
        ],
        orderBy: "id",
        orderType: "DESC",
        cursor: undefined,
        limit: undefined,
      }),
    );

    assert.deepEqual(actualQuery, {
      query:
        "SELECT id, name, email FROM users WHERE name = ? AND email = ? ORDER BY ? ?;",
      params: ["Nick", "nick@mail.com", "id", "DESC"],
    });
  });

  it("Generate select with one contains filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "CONTAINS", "Nick"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name LIKE ?;",
      params: ["%Nick%"],
    });
  });

  it("Generate select with one not contains filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "NOT_CONTAINS", "Nick"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name NOT LIKE ?;",
      params: ["%Nick%"],
    });
  });

  it("Generate simple select paginated", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.emptyPaginated("20", 10),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE id > ? LIMIT ?;",
      params: [20, 10],
    });
  });

  it("Generate simple select paginated with a different cursor name in the query", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.emptyPaginated("20", 10),
      { id: "cursor_id" },
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE cursor_id > ? LIMIT ?;",
      params: [20, 10],
    });
  });

  it("Generate select with not contains filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "NOT_CONTAINS", "Nick"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name NOT LIKE ?;",
      params: ["%Nick%"],
    });
  });

  it("Generate select with not equals filter", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("name", "NOT_EQUAL", "Nick"),
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name != ?;",
      params: ["Nick"],
    });
  });

  it("Generate select with one filter with a different name in the query", () => {
    const actualQuery = converter.convert(
      ["id", "name"],
      "users",
      CriteriaMother.withOneFilter("fullname", "EQUAL", "Nick"),
      { fullname: "name" },
    );

    assert.deepEqual(actualQuery, {
      query: "SELECT id, name FROM users WHERE name = ?;",
      params: ["Nick"],
    });
  });
});
