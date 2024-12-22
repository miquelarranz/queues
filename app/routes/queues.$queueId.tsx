import { fetchQueue, Task } from "~/transport/queues.server";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

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
    <div id="queue">
      {queue.tasks.map((task: Task, index: number) => (
        <h1 key={index}>{task.title}</h1>
      ))}
    </div>
  );
}
