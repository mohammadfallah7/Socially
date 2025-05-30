import { NextRequest, NextResponse } from "next/server";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface CreateTaskPayload {
  title?: string;
}

const tasks: Task[] = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
];

const GET = async () => {
  return NextResponse.json(tasks);
};

const POST = async (request: NextRequest) => {
  const body: CreateTaskPayload = await request.json();

  if (!body.title)
    return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const newTask: Task = {
    id: tasks.length + 1,
    title: body.title,
    completed: false,
  };
  tasks.push(newTask);

  return NextResponse.json(newTask, { status: 201 });
};

const DELETE = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "Id is required" }, { status: 400 });

  const taskIndex = tasks.findIndex((task) => task.id === Number(id));
  if (taskIndex === -1)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });

  tasks.splice(taskIndex, 1);

  return NextResponse.json(
    { message: "Task deleted successfully" },
    { status: 200 }
  );
};

export { GET, POST, DELETE };
