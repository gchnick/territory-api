import {
  DayOfWeek,
  PublisherAvailabilityDayOfWeek,
} from "@/contexts/Secretary/publishers/domain";

export const PublisherAvailabilityDaysOfWeekMother = {
  create(values?: DayOfWeek[]): PublisherAvailabilityDayOfWeek[] {
    const availabilityDays = values?.map(
      v => new PublisherAvailabilityDayOfWeek(v),
    );
    if (availabilityDays) return availabilityDays;

    const days = Object.values(DayOfWeek);
    const randomDays: DayOfWeek[] = [];
    const numDays = 3;

    while (randomDays.length < numDays) {
      const randomIndex = Math.floor(Math.random() * days.length);
      const day = days[randomIndex];
      if (!randomDays.includes(day)) {
        randomDays.push(day);
      }
    }

    return randomDays.map(day => new PublisherAvailabilityDayOfWeek(day));
  },
};
