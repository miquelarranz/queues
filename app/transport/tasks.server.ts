import { createClient } from "~/transport/api-client.server";

export type Task = {
  id: string;
  title: string;
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
