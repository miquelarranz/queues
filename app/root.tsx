import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LinksFunction, redirect } from "@remix-run/node";
import tailwind from "./tailwind.css?url";
import { createEmptyQueue, fetchQueues } from "~/transport/queues.server";
import { Header } from "~/components/header";
import { Queues } from "~/components/queues";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Queue" },
    {
      name: "description",
      content: "Daily task management app",
    },
  ];
};

export const loader = async () => {
  const queues = await fetchQueues();
  return Response.json({
    queues,
  });
};

export const action = async () => {
  const queue = await createEmptyQueue();

  return queue ? redirect(`/queues/${queue.id}/tasks`) : redirect(`/`);
};

export default function App() {
  const { queues } = useLoaderData<typeof loader>();

  const onAddQueueClick = () => {};

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="bg-slate-100 h-screen">
        <Header />
        <main className="flex flex-col gap-8">
          <Queues queues={queues} onAddQueueClick={onAddQueueClick} />

          <div className="flex items-center flex-col h-full mx-40">
            <Outlet />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
