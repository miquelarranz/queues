import {
  Link,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, LinksFunction } from "@remix-run/node";
import tailwind from "./tailwind.css?url";
import { fetchQueues, Queue } from "~/transport/queues.server";

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
  return json({ queues });
};

export default function App() {
  const { queues } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-screen items-center justify-center flex-col gap-4">
          <h1 className="text-3xl font-bold">Queue</h1>
          <nav className="flex flex-col gap-2 items-center">
            {queues.map((queue: Queue) => (
              <Link
                key={queue.id}
                to={`/queues/${queue.id}`}
                className="text-blue-500"
              >
                {queue.name}
              </Link>
            ))}

            <Outlet />
          </nav>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
