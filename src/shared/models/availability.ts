import { Availability, AvailabilityEntity, Days, Moments } from './types';

export const toAvailabilityModel = (
  entity: AvailabilityEntity[] | undefined
) => {
  if (!entity) return undefined;
  const record: Availability = {};

  entity.forEach(a => {
    record[a.day as Days] = {
      frequency: a.frequency,
      moment: Moments[a.moment as Moments],
    };
  });

  return record;
};

export const toAvailabilityEntity = (
  model: Availability | undefined
): AvailabilityEntity[] => {
  if (typeof model === 'undefined') return [];

  const availabilityArray: AvailabilityEntity[] = [];

  for (const key in model) {
    const available = model[key as Days];
    if (available && typeof Days[key as Days] !== 'undefined') {
      availabilityArray.push({
        day: key,
        frequency: available.frequency,
        moment: available.moment,
      });
    }
  }
  return availabilityArray;
};

export const setAvailability = (
  availability: Availability | undefined,
  newAvailability: Availability
) => {
  if (typeof availability === 'undefined') {
    return undefined;
  }

  const current = structuredClone(availability);

  for (const key in newAvailability) {
    const available = newAvailability[key as Days];
    if (available) {
      current[key as Days] = available;
    }
  }

  return current;
};
