import {
  AvailabilityType,
  PublisherAvailabilityType,
} from "@/contexts/Secretary/publishers/domain";

export const PublisherAvailabilityTypeMother = {
  create(value?: AvailabilityType) {
    const randomAvailabilityType =
      Object.values(AvailabilityType)[
        Math.floor(Math.random() * Object.values(AvailabilityType).length)
      ];
    return new PublisherAvailabilityType(value ?? randomAvailabilityType);
  },
};
