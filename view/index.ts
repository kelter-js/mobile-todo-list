export interface IModalWindowProps {
  taskId?: string;
  taskText?: string;
  onCreateReminder: (date: Date) => void;
  onRemoveTask: VoidFunction;
  onMoveTaskBack: VoidFunction;
  onCloseModal: VoidFunction;
  isViewModeInProgress: boolean;
}

export interface INewTaskFormProps {
  addNewTask: (text: string) => void;
}

export interface ITask {
  text: string;
  id: string | Uint8Array;
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
