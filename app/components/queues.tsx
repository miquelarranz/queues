import { Queue } from "~/transport/queues.server";
import { Button } from "~/components/common/button";
import { Form, useNavigation } from "@remix-run/react";

type Props = {
  queues: Queue[];
  onAddQueueClick: VoidFunction;
};

export const Queues = ({ queues, onAddQueueClick }: Props) => {
  const { state } = useNavigation();

  return (
    <nav className="flex gap-2 h-fit mt-8 justify-center">
      {queues.map((queue: Queue) => (
        <Button
          color="blue"
          disabled={state === "loading"}
          key={queue.id}
          isLink
          gotToPath={`/queues/${queue.id}/tasks`}
          text={queue.name}
        />
      ))}
      <Form method="post">
        <Button
          type="submit"
          disabled={state === "loading"}
          onClick={onAddQueueClick}
          color="sky"
          fullRounded
          text="+"
        />
      </Form>
    </nav>
  );
};