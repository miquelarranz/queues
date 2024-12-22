import { createClient } from "~/transport/api-client.server";

export type Task = {
  title: string;
};

export type Queue = {
  id: string;
  name: string;
  tasks: Task[];
};

export const fetchQueues = async () => {
  const { data: queues, error } = await createClient()
    .from("queues")
    .select("id, name");

  if (error) {
    return [];
  }

  return queues as unknown as Queue[];
};

export const fetchQueue = async (queueId: string) => {
  const { data: queue, error } = await createClient()
    .from("queues")
    .select(
      `
      id,
      name,
      tasks (
        id,
        title
      )`
    )
    .eq("id", queueId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return queue as unknown as Queue;
};
