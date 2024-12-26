import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchQueue, updateQueueName } from "~/transport/queues.server";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

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

  return redirect("..");
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

const CancelButton = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("..");
  };

  return (
    <button onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5 text-red-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default function EditQueue() {
  const { queue } = useLoaderData<typeof loader>();

  return (
    <div id="queue" className="flex flex-col w-full items-center gap-2">
      <Form method="post" className="flex gap-2">
        <input
          className="rounded border px-2"
          name="name"
          defaultValue={queue.name}
        />
        <ConfirmButton />
        <CancelButton />
      </Form>
    </div>
  );
}
