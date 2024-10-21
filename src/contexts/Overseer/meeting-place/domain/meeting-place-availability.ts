import { Available, AvailablePrimitives } from "./availability/available";
import { AvailabilityId } from "./availability/availibility-id";

export type AvailabilityPrimitives = {
  id: string;
  values: AvailablePrimitives;
};

export class MeetingPlaceAvailability {
  readonly id: AvailabilityId;
  readonly values: Available;

  constructor(id: AvailabilityId, values: Available) {
    this.id = id;
    this.values = values;
  }

  static fromPrimitives(plainData: {
    availability: AvailabilityPrimitives;
  }): MeetingPlaceAvailability {
    return new MeetingPlaceAvailability(
      new AvailabilityId(plainData.availability.id),
      Available.fromPrimitive(plainData.availability.values),
    );
  }

  toPrimitives(): AvailabilityPrimitives {
    return {
      id: this.id.value,
      values: this.values.toPrimitive(),
    };
  }
}
