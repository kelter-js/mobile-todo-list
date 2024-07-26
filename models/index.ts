import { GestureResponderEvent } from "react-native";

export interface IModalWindowProps {
  onCloseModal: VoidFunction;
  children: React.ReactNode;
  isWindowOpened: boolean;
}

export interface TaskFormProps {
  isViewModeInProgress: boolean;
  onRemoveTask: VoidFunction;
  onMoveTaskBack: VoidFunction;
  taskId: string;
  taskText?: string;
  onCreateReminder: (date: Date, taskId: string | Uint8Array) => void;
  task: ITask;
}

export interface INewTaskFormProps {
  onAdd: (taskData: ITask) => void;
  task?: ITask;
}

export interface ITask {
  description: string;
  title: string;
  isRepeatable: boolean;
  id?: string | Uint8Array;
  triggerDate?: Date;
}

export interface CustomCheckboxProps {
  value: boolean;
  toggleCheckbox: (event: GestureResponderEvent) => void;
}

export interface ITaskProps extends ITask {
  onOpen: (id: string) => void;
  onConfigure: (id: string) => void;
  id: string | Uint8Array;
  isNotConfigurable: boolean;
}

export interface ITaskListProps {
  tasks: Array<ITask>;
  onTaskOpen: (id: string) => void;
  onTaskConfigure: (id: string) => void;
  isViewModeInProgress: boolean;
}

export enum ViewModes {
  FINISHED = "FINISHED",
  IN_PROGRESS = "IN_PROGRESS",
}

export interface FormattedDate {
  year: number;
  month: number;
  date: number;
  hour: number;
  minutes: number;
}

export enum YEAR_SEASONS {
  WINTER = "WINTER",
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  AUTUMN = "AUTUMN",
}

export enum ACTIONS {
  UPDATING = "Updating",
  LOADING = "Loading",
}
