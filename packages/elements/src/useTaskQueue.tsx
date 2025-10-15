
import React, { createContext, useContext, useState, useCallback } from "react";
import type { MessagePart } from "./task-queue-panel";

export type TaskQueueItem =
  { id: string; type: "message"; parts: MessagePart[] }
  | { id: string; type: "todo"; title: string; description?: string; status: "pending" | "completed" };

interface TaskQueueContextType {
  tasks: TaskQueueItem[];
  addTask: (item: TaskQueueItem) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, update: Partial<Omit<TaskQueueItem, 'type'>>) => void;
}

const TaskQueueContext = createContext<TaskQueueContextType | undefined>(undefined);

export const TaskQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskQueueItem[]>([]);

  const addTask = useCallback((item: TaskQueueItem) => {
    setTasks((prev) => [...prev, item]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback((id: string, update: Partial<Omit<TaskQueueItem, 'type'>>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...update } : task)));
  }, []);

  return (
    <TaskQueueContext.Provider value={{ tasks, addTask, removeTask, updateTask }}>
      {children}
    </TaskQueueContext.Provider>
  );
};

export function useTaskQueue() {
  const ctx = useContext(TaskQueueContext);
  if (!ctx) throw new Error("useTaskQueue must be used within a TaskQueueProvider");
  return ctx;
}
