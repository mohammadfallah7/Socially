import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { Task } from "../api/tasks/route";
import CreateTaskForm from "./CreateTaskForm";

const TasksPage = async () => {
  const response = await fetch("http://localhost:3000/api/tasks", {
    method: "GET",
    cache: "no-store",
  });
  const tasks: Task[] = await response.json();

  return (
    <div className="container mx-auto">
      <CreateTaskForm />
      <ul className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{task.title}</CardTitle>
              <form
                action={async () => {
                  "use server";

                  const response = await fetch(
                    `http://localhost:3000/api/tasks?id=${task.id}`,
                    {
                      method: "DELETE",
                    }
                  );

                  if (response.ok) revalidatePath("/tasks");
                }}
              >
                <Button size="sm" variant="secondary">
                  Delete
                </Button>
              </form>
            </CardHeader>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
