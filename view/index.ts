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
  taskId?: string;
  taskText?: string;
  onCreateReminder: (date: Date) => void;
  onOpenEditMode: VoidFunction;
  task: ITask;
}

export interface INewTaskFormProps {
  addNewTask: (taskData: Omit<ITask, "id">) => void;
}

export interface ITask {
  description: string;
  title: string;
  isRepeatable: boolean;
  id: string | Uint8Array;
}

export interface CustomCheckboxProps {
  value: boolean;
  toggleCheckbox: (event: GestureResponderEvent) => void;
}

export interface ITaskProps extends ITask {
  onOpen: (id: string) => void;
  id: string | Uint8Array;
}

export interface ITaskListProps {
  tasks: Array<ITask>;
  onTaskOpen: (id: string) => void;
}

export enum ViewModes {
  FINISHED = "FINISHED",
  IN_PROGRESS = "IN_PROGRESS",
}
