import { SCHEDULE_TYPES } from "./constants";

export interface ScheduleSelectionProps {
  selectedScheduleType: SCHEDULE_TYPES;
  onSelectSchedule: (type: SCHEDULE_TYPES) => void;
  selectedScheduleFrequency: number;
  onSelectFrequency: (frequency: number) => void;
}
