import { GestureResponderEvent } from "react-native";
import { SCHEDULE_TYPES } from "../components/ScheduleSelection/constants";

export interface IModalWindowProps {
  onCloseModal: VoidFunction;
  children: React.ReactNode;
  isWindowOpened: boolean;
  height?: number;
}

export interface TaskData {
  description: string;
  title: string;
  isRepeatable: boolean;
  id?: string | Uint8Array;
  triggerDate?: Date;
  taskColor?: string;
  taskIdentificatorId?: string;
  createdAt?: Date;
  isAutoPlanning?: boolean;
  repeatType?: SCHEDULE_TYPES;
  repeatFrequency?: number;
}

export interface CustomCheckboxProps {
  value: boolean;
  toggleCheckbox: (event: GestureResponderEvent) => void;
}

export interface TaskDataProps extends TaskData {
  id: string | Uint8Array;
  isLastTask: boolean;
}

export interface ColorItem {
  label: string;
  value: string;
}

export interface FormattedDate {
  year: number;
  month: number;
  date: number;
  hour: number;
  minutes: number;
}

export interface NewTaskNotification {
  text: string;
  title: string;
  date: Date;
}
