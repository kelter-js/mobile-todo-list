export interface IModalWindowProps {
  onCloseModal: VoidFunction;
  children: React.ReactNode;
}

export interface TaskFormProps {
  isViewModeInProgress: boolean;
  onRemoveTask: VoidFunction;
  onMoveTaskBack: VoidFunction;
  taskId?: string;
  taskText?: string;
  onCreateReminder: (date: Date) => void;
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
