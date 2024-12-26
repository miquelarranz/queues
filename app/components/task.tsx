import { Task as TaskType } from "~/transport/tasks.server";

type Props = {
  task: TaskType;
};

export const Task = ({ task }: Props) => (
  <div className="min-h-14 h-fit bg-white p-4 rounded-lg shadow-sm w-full">
    <h1>{task.title}</h1>
  </div>
);
