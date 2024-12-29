import {
  Task as TaskType,
  createEmptyTask,
  updateTaskTitle,
  fetchTasks,
  updateTaskStatus,
  TaskStatus,
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

  return Response.json({
    pendingTasks: tasks.filter(({ status }) => status === "pending"),
    completedTasks: tasks.filter(({ status }) => status === "completed"),
  });
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

  if (_action === "update-status") {
    return await updateTaskStatus(
      values.taskId as string,
      values.status as TaskStatus
    );
  }
};

export default function Tasks() {
  const { pendingTasks, completedTasks } = useLoaderData<typeof loader>();
  const hasPendingTasks = pendingTasks.length > 0;
  const hasCompletedTasks = completedTasks.length > 0;

  return (
    <div className="flex flex-col w-full items-center gap-5 overflow-y-scroll pb-2 md:pb-10">
      {pendingTasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}

      {!hasPendingTasks && <p>The queue is empty</p>}

      <div className="divider"></div>

      {!hasCompletedTasks && <p>0 completed tasks</p>}

      {completedTasks.map((task: TaskType) => (
        <Task key={task.id} completed task={task} />
      ))}

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
