import { Task as TaskType } from "~/transport/tasks.server";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useFetcher } from "@remix-run/react";

type Props = {
  task: TaskType;
};

export const Task = ({ task }: Props) => {
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

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";
  const placeholder = "Describe your next task...";
  const hasEmptyTitle = !task.title || task.title === "";

  return (
    <div className="card card-compact bg-base-100 w-full shadow-sm">
      <div className="card-body" style={{ minHeight: 52 }}>
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
          <p onClick={() => setIsEditing(true)}>
            {hasEmptyTitle ? placeholder : task.title}
          </p>
        )}
      </div>
    </div>
  );
};
