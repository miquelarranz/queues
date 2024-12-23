import { Queue } from "~/transport/queues.server";
import { Link } from "@remix-run/react";

type Props = {
  queues: Queue[];
};

export const Queues = ({ queues }: Props) => (
  <nav className="flex gap-2 h-fit mt-8 justify-center">
    {queues.map((queue: Queue) => (
      <Link
        key={queue.id}
        to={`/queues/${queue.id}`}
        className="bg-orange-400 hover:bg-orange-300 shadow-md rounded-lg text-white px-4 py-2 h-10"
      >
        {queue.name}
      </Link>
    ))}
    <button className="ml-4 bg-slate-400 hover:bg-slate-300 shadow-md rounded-full text-white px-4 py-2 h-10">
      +
    </button>
  </nav>
);
