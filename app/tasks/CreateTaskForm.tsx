"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateTaskForm = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const router = useRouter();

  return (
    <div className="mb-5 gap-10 flex justify-between items-center">
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Add a task"
        className="w-full bg-transparent border p-2 rounded-lg"
      />
      <Button
        onClick={async () => {
          if (!taskTitle) return;

          const response = await fetch("http://localhost:3000/api/tasks", {
            method: "POST",
            body: JSON.stringify({ title: taskTitle }),
          });

          if (response.ok) {
            // Refresh Page in client component
            router.refresh();
            setTaskTitle("");
          }
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default CreateTaskForm;
