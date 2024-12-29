import { Task as TaskType } from "~/transport/tasks.server";
import { ChangeEvent, KeyboardEvent, useState, MouseEvent } from "react";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/components/common/button";
import { CheckIcon } from "~/components/icons/check-icon";
import { TrashIcon } from "~/components/icons/trash-icon";

type Props = {
  task: TaskType;
  completed?: boolean;
};

export const Task = ({ task, completed }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher();

  const handleTaskTitleUpdate = (
    event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    setIsEditing(false);

    if (event.currentTarget.value === task.title) {
      return;
    }

    fetcher.submit(
      {
        title: event.currentTarget.value,
        taskId: task.id,
        _action: "update-title",
      },
      { method: "post" }
    );
  };

  const handleOnComplete = () => {
    fetcher.submit(
      {
        status: "completed",
        taskId: task.id,
        _action: "update-status",
      },
      { method: "post" }
    );
  };

  const handleOnDelete = (event: MouseEvent<HTMLButtonElement>) => {
    const response = confirm("Please confirm you want to delete this task.");
    if (!response) {
      event.preventDefault();
      return;
    }

    fetcher.submit(
      {
        status: "deleted",
        taskId: task.id,
        _action: "update-status",
      },
      { method: "post" }
    );
  };

  const fetcherAction = fetcher.formData?.get("_action");

  const isLoading =
    fetcher.state !== "idle" && fetcherAction === "update-title";
  const isChangingStatus =
    fetcher.state !== "idle" && fetcherAction === "update-status";
  const placeholder = "Describe your next task...";
  const hasEmptyTitle = !task.title || task.title === "";

  if (isChangingStatus) {
    return null;
  }

  return (
    <div
      className={`card card-compact ${
        completed ? "bg-base-200" : "bg-base-100"
      } w-full shadow-sm`}
    >
      <div
        className="card-body flex-row items-center"
        style={{ minHeight: 52 }}
      >
        {isLoading ? (
          <div className="skeleton h-4 w-32"></div>
        ) : isEditing ? (
          <input
            autoFocus
            placeholder={placeholder}
            className="input input-xs w-full"
            onBlur={handleTaskTitleUpdate}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleTaskTitleUpdate(event);
              }
            }}
            type="text"
            defaultValue={task.title}
          />
        ) : (
          <p
            className={`h-5 ${completed ? "line-through" : ""}`}
            onClick={() => !completed && setIsEditing(true)}
          >
            {hasEmptyTitle ? placeholder : task.title}
          </p>
        )}

        {!isLoading && !completed && (
          <div className="flex gap-4">
            <Button
              onClick={handleOnComplete}
              size="micro"
              leftIcon={<CheckIcon />}
              fullRounded
              kind="primary"
              outlined
            />
            <Button
              onClick={handleOnDelete}
              size="micro"
              leftIcon={<TrashIcon />}
              fullRounded
              kind="ghost"
            />
          </div>
        )}
      </div>
    </div>
  );
};
