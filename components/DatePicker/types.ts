export type AndroidMode = "date" | "time";

export interface DatePickerProps {
  date: Date;
  setSelectedDate: (date: Date) => void;
}
