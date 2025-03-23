import {
    Frequency,
    PublisherAvailabilityFrequency,
} from "@/contexts/Secretary/publishers/domain/availability/publisher-availability-frequency";

export const PublisherAvailabilityFrequencyMother = {
  create(value?: Frequency) {
    const randomFrequency =
      Object.values(Frequency)[
        Math.floor(Math.random() * Object.values(Frequency).length)
      ];
    return new PublisherAvailabilityFrequency(value ?? randomFrequency);
  },
};
