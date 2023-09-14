import { Availability, AvailabilityEntity, Days, Moments } from './types';

export const toAvailabilityModel = (
  entity: AvailabilityEntity[] | undefined
) => {
  if (!entity) return undefined;
  const record: Availability = {};

  entity.forEach((a) => {
    record[a.day as Days] = {
      frequency: a.frequency,
      moment: Moments[a.moment as Moments]
    };
  });

  return record;
};

export const getAvailableCreateQuery = (
  availability: Availability | undefined
) => {
  if (typeof availability === 'undefined') return [];

  const availableArray: { day: string; frequency: string; moment: string }[] =
    [];

  for (const key in availability) {
    const available = availability[key as Days];
    if (available) {
      availableArray.push({
        day: key,
        frequency: available.frequency,
        moment: available.moment
      });
    }
  }

  return availableArray;
};

export const setAvailability = (
  availavility: Availability | undefined,
  newAvailability: Availability
) => {
  if (typeof availavility === 'undefined') {
    return undefined;
  }

  const current = structuredClone(availavility);

  for (const key in newAvailability) {
    const available = newAvailability[key as Days];
    if (available) {
      current[key as Days] = available;
    }
  }

  return current;
};
