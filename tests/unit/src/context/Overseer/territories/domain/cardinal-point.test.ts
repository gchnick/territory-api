import {
  CardinalPoint,
  CardinalPoints,
} from "@/contexts/Overseer/territories/domain/cardinal-points";
import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";

describe("CardinalPiont should", () => {
  it("to be defined", () => {
    const north = CardinalPoints.NORTH;
    const cardinalPoint = new CardinalPoint(north);

    expect(cardinalPoint).toBeDefined();
  });

  it("compare to equal cardinal point", () => {
    const northCardinalPoint = CardinalPoint.fromValue("NORTH");
    const soutCardinalPoint = CardinalPoint.fromValue("SOUTH");
    const otherNorthCardinalPoint = CardinalPoint.fromValue("NORTH");

    const isEqual = northCardinalPoint.equals(otherNorthCardinalPoint);
    const isNotEqual = northCardinalPoint.equals(soutCardinalPoint);

    expect(isEqual).toBe(true);
    expect(isNotEqual).toBe(false);
  });

  it("throw error when use invalid argument", () => {
    const invalidArgument = "invalidString";

    const invalidInstance = () => {
      CardinalPoint.fromValue(invalidArgument);
    };

    expect(invalidInstance).toThrowError(InvalidArgumentError);
  });
});
