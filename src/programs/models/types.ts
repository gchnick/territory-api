import { Conductor } from '../../conductors/models/types';
import { MeetingPlace } from '../../meeting-place/types';

export type Assignament = {
  id?: string;
  date: Date;
  meetingPlace: MeetingPlace;
  conductor: Conductor;
};

export type PartialAssignament = Partial<Assignament>;

export type Program = {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  sinceWeek: Date;
  untilWeek: Date;
  assignaments?: Assignament[];
};

export type PartialProgram = Partial<Program>;

export type ProgramEntity = {
  id: string;
  created_at: Date;
  updated_at: Date;
  since_week: Date;
  until_week: Date;
};

export type AssignamentEntity = {
  id: string;
  date: Date;
  meeting_place_id: string;
  coductor_id: string;
  program_id: string;
};

export type ProgramEntityWithAssignaments = ProgramEntity & {
  assignaments: AssignamentEntity[];
};

export type Entity = ProgramEntity | ProgramEntityWithAssignaments;
