//! npm install uuid

"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";

export default function TaskPage() {
  const [tasks, setTasks] = useState([
    { id: uuidv4(), text: "Umýt vanu", status: false },
    { id: uuidv4(), text: "Uvařit večeři", status: false },
  ]);

  const handleChange = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: !task.status } : task
    ));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const [task, setTask] = useState("");

  const handleClick = () => {
    if (task.trim() === "") {
      alert("Task nemůže být prázdný");
      return;
    }

    const newTask = {
      id: uuidv4(),
      text: task,
      status: false,
    };

    setTasks([...tasks, newTask]);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6 pt-8 pb-24">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">Todo App</h1>
          <p className="text-sm">NextJs ukolníček</p>
        </div>
        <div className="form-group">
          <div className="form-field">
            <label className="form-label text-gray-700">Zadejte úkol</label>

            <input
              placeholder="Zadejte úkol"
              type="text"
              className="input max-w-full bg-inherit text-black"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <label className="form-label">
              <span className="form-label-alt">Neplatný formát</span>
            </label>
          </div>

          <div className="form-field pt-3">
            <div className="form-control justify-between">
              <button
                type="button"
                onClick={handleClick}
                className="btn btn-primary w-full"
              >
                Vložit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*Seznam úkolů */}
      <div className="mx-auto flex w-full max-w-xl px-2 mb-12 flex-col gap-3 md:gap-4 pt-8 pb-24">
        <h2 className="text-xl font-semibold">Seznam úkolů</h2>
        {tasks.filter(oneTask => !oneTask.status).map((oneTask) => (
          <Task
            key={oneTask.id}
            taskText={oneTask.text}
            change={() => handleChange(oneTask.id)}
            status={oneTask.status}
            deleteTask={() => handleDelete(oneTask.id)}
          />
        ))}

        <h2 className="text-xl font-semibold mt-12">Splněné úkoly</h2>
        {tasks
          .filter((oneTask) => oneTask.status)
          .map((oneTask) => (
            <Task
              key={oneTask.id}
              taskText={oneTask.text}
              change={() => handleChange(oneTask.id)}
              status={oneTask.status}
              deleteTask={() => handleDelete(oneTask.id)}
            />
          ))}
      </div>
    </>
  );
}
