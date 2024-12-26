import { fetchQueue, Task as TaskType } from "~/transport/queues.server";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
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

const DeleteButton = () => (
  <Form
    action="delete"
    method="post"
    className="h-5"
    onSubmit={(event) => {
      const response = confirm(
        "Please confirm you want to delete this queue. You will lose all the tasks too"
      );
      if (!response) {
        event.preventDefault();
      }
    }}
  >
    <button type="submit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 text-slate-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    </button>
  </Form>
);

const EditNameButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`./update`)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 text-slate-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>
    </button>
  );
};

export default function Queue() {
  const { queue } = useLoaderData<typeof loader>();

  return (
    <div id="queue" className="flex flex-col w-full items-center gap-5">
      <section className="flex gap-2 items-center justify-center h-10">
        <p className="text-sm text-slate-500"> Actions:</p>
        <DeleteButton />
        <EditNameButton />
        <Outlet />
      </section>

      {queue.tasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}
