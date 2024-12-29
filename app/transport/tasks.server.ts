import { createClient } from "~/transport/api-client.server";

export type TaskStatus = "pending" | "completed" | "deleted";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
};

export const fetchTasks = async (queueId: string) => {
  const { data: tasks, error } = await createClient()
    .from("tasks")
    .select(
      `
        id,
        title,
        status
      `
    )
    .order("created_at")
    .eq("queue_id", queueId);

  if (error) {
    return null;
  }

  return tasks as unknown as Task[];
};

export const createEmptyTask = async (queueId: string) => {
  const { error, data: task } = await createClient()
    .from("tasks")
    .insert({ title: "", queue_id: queueId })
    .select()
    .single();

  if (error) {
    return null;
  }

  return task as Task;
};

export const updateTaskTitle = async (taskId: string, title: string) => {
  const { error, data: task } = await createClient()
    .from("tasks")
    .update({ title })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return null;
  }

  return task as Task;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  const { error, data: task } = await createClient()
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return null;
  }

  return task as Task;
};
