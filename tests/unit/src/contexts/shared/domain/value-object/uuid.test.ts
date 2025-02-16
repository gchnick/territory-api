import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@/contexts/shared/domain/value-object/uuid";

describe("Uuid should", () => {
  it("throw error when id is string empty", () => {
    const uuidEmpty = "      ";

    const uuidInstance = () => {
      new Uuid(uuidEmpty);
    };

    expect(uuidInstance).toThrow(InvalidArgumentError);
  });

  it("throw error when id object", () => {
    const idObject = Uuid.random() as unknown as string;

    const uuidInstance = () => {
      new Uuid(idObject);
    };

    expect(uuidInstance).toThrow(InvalidArgumentError);
  });
});
