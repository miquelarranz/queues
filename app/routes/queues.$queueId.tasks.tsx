import {
  Task as TaskType,
  createEmptyTask,
  updateTaskTitle,
  fetchTasks,
} from "~/transport/tasks.server";
import { type ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Task } from "~/components/task";
import { Button } from "~/components/common/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");

  const tasks = await fetchTasks(params.queueId);

  if (!tasks) {
    throw new Response("Not Found", { status: 404 });
  }

  return Response.json({ tasks });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.queueId, "Missing queueId param");
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "create") {
    return await createEmptyTask(params.queueId);
  }

  if (_action === "update-title") {
    return await updateTaskTitle(
      values.taskId as string,
      values.title as string
    );
  }
};

const AddTaskButton = () => {
  return (
    <Form method="post">
      <button
        type="submit"
        name="_action"
        value="create"
        className="rounded-full hover:bg-slate-200 p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-6 text-blue-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </Form>
  );
};

export default function Queue() {
  const { tasks } = useLoaderData<typeof loader>();
  const hasTasks = tasks.length > 0;

  return (
    <div className="flex flex-col w-full items-center gap-5 overflow-y-scroll">
      {hasTasks ? (
        <>
          {tasks.map((task: TaskType) => (
            <Task key={task.id} task={task} />
          ))}
          <span className="w-full text-end">
            <AddTaskButton />
          </span>
        </>
      ) : (
        <Form method="post">
          <Button
            type="submit"
            name="_action"
            value="create"
            kind="primary"
            size="small"
            text={"Add a task!"}
          />
        </Form>
      )}
    </div>
  );
}
