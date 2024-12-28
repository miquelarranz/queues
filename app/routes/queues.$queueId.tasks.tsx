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

export default function Queue() {
  const { tasks } = useLoaderData<typeof loader>();
  const hasTasks = tasks.length > 0;

  return (
    <div className="flex flex-col w-full items-center gap-5 overflow-y-scroll">
      {tasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}

      {!hasTasks && <p>This queue is empty</p>}

      {hasTasks && <div className="divider"></div>}

      <span className="absolute bottom-8 right-8">
        <Form method="post">
          <Button
            type="submit"
            name="_action"
            value="create"
            kind="secondary"
            fullRounded
            text="+"
          />
        </Form>
      </span>
    </div>
  );
}
