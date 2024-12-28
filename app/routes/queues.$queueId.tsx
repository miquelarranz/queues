import { fetchQueue } from "~/transport/queues.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/common/button";

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
      <section className="flex gap-2 justify-end w-full">
        <Button
          isLink
          gotToPath={`/queues/${queue.id}/settings`}
          text="Settings"
          size="small"
        />
      </section>
      <section className="w-full">
        <Outlet />
      </section>
    </div>
  );
}
