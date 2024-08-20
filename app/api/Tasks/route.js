import connectDB from "../../utils/connectDB";
import TaskModel from "../../(models)/TaskModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("Received data:", body.newTask); // Zde přidejte log, aby jste viděli, co přichází
    const taskData = body.newTask;
    const task = await TaskModel.create(taskData);
    console.log("Created task:", task); // Logujte, co bylo vytvořeno
    return new NextResponse(JSON.stringify({ message: "Task created" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create task:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  try {
    const tasks = await TaskModel.find();
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  await connectDB();

  try {
    const { id, updateData } = await req.json();
    const updatedTask = await TaskModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task updated", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectDB();

  try {
    const { id } = await req.json();
    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
