import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createEmptyQueue, fetchQueues } from "~/transport/queues.server";
import { Header } from "~/components/header";
import { Queues } from "~/components/queues";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const queues = await fetchQueues();

  const url = new URL(request.url);
  if (url.pathname === `/queues` && queues.length > 0) {
    return redirect(`/queues/${queues[0].id}/tasks`);
  }

  return Response.json({
    queues,
  });
};

export const action = async () => {
  const queue = await createEmptyQueue();

  return queue ? redirect(`/queues/${queue.id}/tasks`) : redirect(`/`);
};

export default function Index() {
  const { queues } = useLoaderData<typeof loader>();

  return (
    <>
      <Header />
      <main className="flex flex-col mx-5 lg:mx-40">
        <Queues queues={queues} />

        <div className="divider"></div>

        <div
          className="flex items-center flex-col overflow-y-scroll"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
}
