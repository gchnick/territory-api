import { Hope, PublisherHope } from "@/contexts/Secretary/publishers/domain";

export const PublisherHopeMother = {
  create(value?: Hope) {
    const randomHope =
      Object.values(Hope)[
        Math.floor(Math.random() * Object.values(Hope).length)
      ];
    return new PublisherHope(value ?? randomHope);
  },
};
