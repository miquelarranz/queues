import { fetchQueue } from "~/transport/queues.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const queue = await fetchQueue(params.queueId);

  if (!queue) {
    throw new Response("Not Found", { status: 404 });
  }

  return Response.json({ queue });
};

export default function Queue() {
  const { queue } = useLoaderData<typeof loader>();

  return (
    <div id="queue" className="flex flex-col w-full items-center gap-5">
      <section className="flex gap-2 items-center justify-center h-10">
        <a
          href={`/queues/${queue.id}/settings`}
          className="text-sm text-slate-500 hover:underline"
        >
          Settings
        </a>
      </section>
      <Outlet />
    </div>
  );
}
