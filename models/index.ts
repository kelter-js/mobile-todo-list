import { GestureResponderEvent } from "react-native";
import { SCHEDULE_TYPES } from "../components/ScheduleSelection/constants";

export interface IModalWindowProps {
  onCloseModal: VoidFunction;
  children: React.ReactNode;
  isWindowOpened: boolean;
  height?: number;
}

export interface TaskFormProps {
  isViewModeInProgress: boolean;
  onRemoveTask: (id: string, isPermanentDeletion?: boolean) => void;
  onMoveTaskBack: VoidFunction;
  taskId: string;
  taskText?: string;
  onCreateReminder: (date: Date, task: ITask) => void;
  task: ITask;
}

export interface ConfirmDeletionProps {
  taskId: string;
  onRemoveTask: (id: string, isPermanentDeletion?: boolean) => void;
  task: ITask;
  onClose: VoidFunction;
}

export interface INewTaskFormProps {
  onClear: VoidFunction;
  isViewModeInProgress?: boolean;
  disabled: boolean;
  toggleTaskForm: VoidFunction;
}

export interface INewTaskModalFormProps {
  onAdd: (taskData: ITask) => void;
  task?: ITask;
  onClose: VoidFunction;
}

export interface ITask {
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

export interface ITaskProps extends ITask {
  onOpen: (id: string) => void;
  onConfigure: (id: string) => void;
  onDelete: (id: string) => void;
  id: string | Uint8Array;
  isNotConfigurable: boolean;
  isLastTask: boolean;
}

export interface ITaskListProps {
  tasks: Array<ITask>;
  onTaskOpen: (id: string) => void;
  onTaskConfigure: (id: string) => void;
  onTaskDelete: (id: string) => void;
  isViewModeInProgress: boolean;
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
