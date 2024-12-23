import { fetchQueue, Task as TaskType } from "~/transport/queues.server";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Task } from "~/components/task";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const queue = await fetchQueue(params.queueId);

  if (!queue) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ queue });
};

// 0k3y0QlVoZJtngBz

export default function Queue() {
  const { queue } = useLoaderData<typeof loader>();

  return (
    <div id="queue" className="w-full">
      {queue.tasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}
