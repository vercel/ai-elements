"use client";

import { useTaskQueue, TaskQueueProvider } from "@repo/elements/useTaskQueue";
import { TaskQueuePanel } from "@repo/elements/task-queue-panel";
import { useEffect } from "react";
import type { TaskQueueItem } from "@repo/elements/useTaskQueue";

const DUMMY_TASKS: TaskQueueItem[] = [
      {
      id: 'todo-1',
      type: 'todo',
      title: 'Write project documentation',
      description: 'Complete the README and API docs',
        status: 'completed',
    },
    {
      id: 'todo-2',
      type: 'todo',
      title: 'Implement authentication',
      status: 'pending',
    },
    {
      id: 'todo-3',
      type: 'todo',
      title: 'Fix bug #42',
      description: 'Resolve crash on settings page',
      status: 'pending',
    },
    {
      id: 'todo-4',
      type: 'todo',
      title: 'Refactor queue logic',
      description: 'Unify queue and todo state management',
      status: 'pending',
    },
    {
      id: 'todo-5',
      type: 'todo',
      title: 'Add unit tests',
      description: 'Increase test coverage for hooks',
      status: 'pending',
    },
    // Sample pending messages
    {
        id: 'msg-1',
        type: 'message',
        parts: [
            { type: 'text', text: 'How do I set up the project?' }
        ]
    },
    {
        id: 'msg-2',
        type: 'message',
        parts: [
            { type: 'text', text: 'What is the roadmap for Q4?' }
        ]
    },
    {
        id: 'msg-3',
        type: 'message',
        parts: [
            { type: 'text', text: 'Can you review my PR?' }
        ]
    },
    {
        id: 'msg-4',
        type: 'message',
        parts: [
            { type: 'text', text: 'Please generate a changelog.' }
        ]
    },
    {
        id: 'msg-5',
        type: 'message',
        parts: [
            { type: 'text', text: 'Add dark mode support.' }
        ]
    },
    {
        id: 'msg-6',
        type: 'message',
        parts: [
            { type: 'text', text: 'Optimize database queries.' }
        ]
    },
    {
        id: 'msg-7',
        type: 'message',
        parts: [
            { type: 'text', text: 'Set up CI/CD pipeline.' }
        ]
    }
]

const ExampleInner = () => {
  const { tasks, removeTask , addTask} = useTaskQueue();

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

  useEffect(() => {
    DUMMY_TASKS.forEach(addTask);
  }, [addTask]);
  

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