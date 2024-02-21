import { CardinalPoint } from "@contexts/registry/territories/domain/cardinal-points";

describe("CardinalPiont should", () => {
  it("comprare to CardinalPoints enum and return true if is equal", () => {
    const north = CardinalPoint.fromValue("NORTH");
    const south = CardinalPoint.fromValue("SOUTH");
    const east = CardinalPoint.fromValue("EAST");
    const west = CardinalPoint.fromValue("WEST");

    const currentNorth = north.isNorth();
    const currentSouth = south.isSouth();
    const currentEast = east.isEast();
    const currentWest = west.isWest();

    expect(currentNorth).toBe(true);
    expect(currentSouth).toBe(true);
    expect(currentEast).toBe(true);
    expect(currentWest).toBe(true);
  });

  it("comprare to CardinalPoints enum and return false if is not equal", () => {
    const north = CardinalPoint.fromValue("NORTH");
    const south = CardinalPoint.fromValue("SOUTH");
    const east = CardinalPoint.fromValue("EAST");
    const west = CardinalPoint.fromValue("WEST");

    const currentNorth = south.isNorth();
    const currentSouth = west.isSouth();
    const currentEast = north.isEast();
    const currentWest = east.isWest();

    expect(currentNorth).toBe(false);
    expect(currentSouth).toBe(false);
    expect(currentEast).toBe(false);
    expect(currentWest).toBe(false);
  });
});
