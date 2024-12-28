import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchQueue, Queue, updateQueueName } from "~/transport/queues.server";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/common/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const queue = await fetchQueue(params.queueId);

  if (!queue) {
    throw new Response("Not Found", { status: 404 });
  }

  return Response.json({ queue });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const formData = await request.formData();
  const newName = formData.get("name");

  await updateQueueName(params.queueId, newName as string);

  return Response.json({});
};

const DeleteQueue = () => (
  <Form
    action="delete"
    method="post"
    className="flex gap-2 items-center"
    onSubmit={(event) => {
      const response = confirm(
        "Please confirm you want to delete this queue. You will lose all the tasks too"
      );
      if (!response) {
        event.preventDefault();
      }
    }}
  >
    <label className="text-sm" htmlFor="name">
      Delete queue permanently:
    </label>
    <Button
      type="submit"
      kind="error"
      size="micro"
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      }
    />
  </Form>
);

const EditQueueName = ({ queue }: { queue: Queue }) => (
  <Form method="post" className="flex gap-2 items-center">
    <label className="text-sm" htmlFor="name">
      Edit queue name:
    </label>
    <input
      className="input input-sm input-bordered"
      name="name"
      defaultValue={queue.name}
    />
    <Button
      type="submit"
      kind="primary"
      size="micro"
      fullRounded
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      }
    ></Button>
  </Form>
);

export default function QueueSettings() {
  const { queue } = useLoaderData<typeof loader>();
  console.log(queue);
  return (
    <section className="flex flex-col gap-8 rounded-lg bg-white p-8 shadow-sm">
      <h1 className="text-xl">Queue settings</h1>
      <div className="flex flex-col gap-4">
        <EditQueueName queue={queue} />
        <DeleteQueue />
      </div>
    </section>
  );
}
