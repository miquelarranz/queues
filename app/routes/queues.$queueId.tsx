import { fetchQueue } from "~/transport/queues.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/common/button";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname === `/queues/${params.queueId}`) {
    return redirect(`/queues/${params.queueId}/tasks`);
  }

  invariant(params.queueId, "Missing queueId param");

  const queue = await fetchQueue(params.queueId);

  if (!queue) {
    throw new Response("Not Found", { status: 404 });
  }

  return Response.json({ queue });
};

export default function Queue() {
  const { queue } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  const inSettings = pathname.includes("settings");

  return (
    <div id="queue" className="flex flex-col w-full items-center gap-5">
      <section className="flex gap-2 justify-end w-full">
        <Button
          isLink
          gotToPath={
            inSettings
              ? `/queues/${queue.id}/tasks`
              : `/queues/${queue.id}/settings`
          }
          text={inSettings ? "Back to the list" : "Settings"}
          size="small"
        />
      </section>
      <section className="w-full">
        <Outlet />
      </section>
    </div>
  );
}
