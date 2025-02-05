import { InvalidArgumentError } from "@/contexts/shared/domain/value-object/invalid-argument-error";
import { Uuid } from "@/contexts/shared/domain/value-object/uuid";

describe("Uuid should", () => {
  it("throw error when id is string empty", () => {
    const uuidEmpty = "      ";

    const uuidInstace = () => {
      new Uuid(uuidEmpty);
    };

    expect(uuidInstace).toThrow(InvalidArgumentError);
  });

  it("throw error when id object", () => {
    const idObject = Uuid.random() as unknown as string;

    const uuidInstace = () => {
      new Uuid(idObject);
    };

    expect(uuidInstace).toThrow(InvalidArgumentError);
  });
});
