const isTaskExpired = (taskDate: Date): boolean =>
  Boolean(taskDate < new Date());

export default isTaskExpired;
