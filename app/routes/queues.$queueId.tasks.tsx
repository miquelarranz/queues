import { fetchQueue } from "~/transport/queues.server";
import { Task as TaskType, createEmptyTask } from "~/transport/tasks.server";
import { type ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Task } from "~/components/task";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const queue = await fetchQueue(params.queueId);

  if (!queue) {
    throw new Response("Not Found", { status: 404 });
  }

  return Response.json({ queue });
};

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");
  const task = await createEmptyTask(params.queueId);

  return Response.json({ task });
};

const AddTaskButton = () => {
  return (
    <Form method="post">
      <button type="submit" className="rounded-full hover:bg-slate-200 p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-6 text-blue-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </Form>
  );
};

export default function Queue() {
  const { queue } = useLoaderData<typeof loader>();

  return (
    <>
      {queue.tasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}
      <span className="w-full text-end">
        <AddTaskButton />
      </span>
    </>
  );
}
