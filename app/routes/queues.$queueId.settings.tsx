import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchQueue, updateQueueName } from "~/transport/queues.server";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/common/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const queue = await fetchQueue(params.queueId);

  if (!queue) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ queue });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const formData = await request.formData();
  const newName = formData.get("name");

  await updateQueueName(params.queueId, newName as string);

  return redirect("../tasks");
};

const ConfirmButton = () => {
  return (
    <button type="submit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 text-green-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    </button>
  );
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

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(`../tasks`)} text="Back" color="slate" />
  );
};

export default function EditQueue() {
  const { queue } = useLoaderData<typeof loader>();

  return (
    <section className="flex gap-8 items-center justify-center h-10">
      <BackButton />
      <div id="queue" className="flex flex-col w-full items-center gap-2">
        <Form method="post" className="flex gap-2">
          <input
            className="rounded border px-2"
            name="name"
            defaultValue={queue.name}
          />
          <ConfirmButton />
        </Form>
      </div>
      <DeleteButton />
    </section>
  );
}
