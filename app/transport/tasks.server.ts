import { createClient } from "~/transport/api-client.server";
import { Queue } from "~/transport/queues.server";

export type Task = {
  id: string;
  title: string;
};

export const fetchTasks = async (queueId: string) => {
  const { data: queue, error } = await createClient()
    .from("tasks")
    .select(
      `
        id,
        title
      `
    )
    .order("created_at")
    .eq("queue_id", queueId);

  if (error) {
    return null;
  }

  return queue as unknown as Queue;
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
