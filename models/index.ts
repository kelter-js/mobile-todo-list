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
  onClear: VoidFunction;
  isViewModeInProgress?: boolean;
}

export interface INewTaskModalFormProps {
  onAdd: (taskData: ITask) => void;
  task?: ITask;
}

export interface ITask {
  description: string;
  title: string;
  isRepeatable: boolean;
  id?: string | Uint8Array;
  triggerDate?: Date;
  taskColor?: string;
  taskIdentificatorId?: string;
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
