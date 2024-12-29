import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchQueue, Queue, updateQueueName } from "~/transport/queues.server";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/common/button";
import { CheckIcon } from "~/components/icons/check-icon";
import { TrashIcon } from "~/components/icons/trash-icon";

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
    action="destroy"
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
    <Button type="submit" kind="error" size="micro" leftIcon={<TrashIcon />} />
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
      outlined
      leftIcon={<CheckIcon />}
    ></Button>
  </Form>
);

export default function QueueSettings() {
  const { queue } = useLoaderData<typeof loader>();

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
