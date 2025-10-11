"use client";

import { useTaskQueue, TaskQueueProvider } from "@repo/elements/useTaskQueue";
import { TaskQueuePanel } from "@repo/elements/task-queue-panel";

const ExampleInner = () => {
  const { tasks, removeTask} = useTaskQueue();

  // Filter tasks for queue and todo
  const queueTasks = tasks.filter((task: typeof tasks[number]) => task.type === "message");
  const todoTasks = tasks.filter((task: typeof tasks[number]) => task.type === "todo");


  function getQueueMessages() {
    return queueTasks.map((message: Extract<typeof tasks[number], { type: "message" }>) => ({
      id: message.id,
      parts: message.parts,
    }));
  }

  function getTodoItems() {
    return todoTasks.map((task: Extract<typeof tasks[number], { type: "todo" }>) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
    }));
  }
  

  return (
      <TaskQueuePanel
        messages={getQueueMessages()}
        todos={getTodoItems()}
        onRemoveQueue={(id: string) => removeTask(id)}
        onRemoveTodo={(id: string) => removeTask(id)}
      />
  );
};


const Example = () => (
  <TaskQueueProvider>
    <ExampleInner />
  </TaskQueueProvider>
);


export default Example;