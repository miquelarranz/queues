import { createClient } from "~/transport/api-client.server";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { Task } from "~/transport/tasks.server";

export type Queue = {
  id: string;
  name: string;
  tasks: Task[];
};

export const fetchQueues = async () => {
  const { data: queues, error } = await createClient()
    .from("queues")
    .select("id, name")
    .order("created_at");

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

export const createEmptyQueue = async () => {
  const { data: queue, error } = await createClient()
    .from("queues")
    .insert({ name: uniqueNamesGenerator({ dictionaries: [animals] }) })
    .select("id")
    .single();

  if (error) {
    return null;
  }

  return queue as Queue;
};

export const deleteQueue = async (queueId: string) => {
  await createClient().from("queues").delete().eq("id", queueId);
};

export const updateQueueName = async (queueId: string, name: string | null) => {
  if (!name) {
    return;
  }

  await createClient().from("queues").update({ name }).eq("id", queueId);
};
