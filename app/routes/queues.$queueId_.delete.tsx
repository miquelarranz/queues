import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteQueue } from "~/transport/queues.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");
  await deleteQueue(params.queueId);

  return redirect("/");
};
