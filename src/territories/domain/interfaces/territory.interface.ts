import { Limits } from '../territory-limits';
import { IMeetingPlace } from './meeting-place.interface';

export type ITerritory = {
  id?: string;
  number: number;
  label: string;
  urlMapImage?: string;
  limits: Limits;
  lastDateCompleted: Date;
  isLocked: boolean;
  meetingPlaces?: IMeetingPlace[];
};
export type PartialITerritory = Partial<ITerritory>;
