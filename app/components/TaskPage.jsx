//! npm install uuid
//todo dokončit edit button. Potřebuji vyřešit, aby mi do editBtn tlačítka šlo id daného tásku a já na to následně změnil text

"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";

export default function TaskPage() {
  const [tempID, setTempID] = useState("");
  const [tasks, setTasks] = useState([
    { id: uuidv4(), text: "Vymyslet formát datumu a času", status: false },
    {
      id: uuidv4(),
      text: "Přidat ukládání/edit/mazání do local storage",
      status: false,
    },
    { id: uuidv4(), text: "Přidat filtry", status: false },
    {
      id: uuidv4(),
      text: "Přidat ukazatel kolik ještě zbýva splnit",
      status: false,
    },
    {
      id: uuidv4(),
      text: "Odstranit černý checkbox při hoveru (theme problém)",
      status: false,
    },
    {
      id: uuidv4(),
      text: "Přidání úkolu bude schované pdo tlačítkem 'nový ukol'",
      status: false,
    },
    {
      id: uuidv4(),
      text: "Další verze jako film picker",
      status: false,
    },
  ]);

  const formState = {
    inputLabel: "",
    spanLabel: "",
    formText: "",
  };

  const handleChange = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task,
      ),
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Po kliknutí na edit button se načte value daného úkolu
  const handleEditBtn = (id) => {
    setTempID(id);
    tasks.map((one) => {
      if (one.id === id) {
        console.log("if test je: " + one.text);
        setEditValue(one.text);
      }
    });
  };

  // Save button v edit modalu
  const handleSave = (id) => {
    console.log(id);
    setTasks(
      tasks.map((one) => (one.id === id ? { ...one, text: editValue } : one)),
    );

    setEditValue("");

    /** Starý zápis
     * tasks.map((one) => {
        if (one.id === id) {
          console.log("Log funguje ");
          console.log(one);
          return {...one, text: "test"}
        }
        return one
      }),
     */
  };

  const [task, setTask] = useState("Testovací zpráva na začátek");
  const [editValue, setEditValue] = useState("");

  const handleClick = () => {
    if (task.trim() === "") {
      // dodělat
      formState.inputLabel = "input-error";
      formState.inputLabel = "text-error";
      formState.formText = "Input nemůže být prázdný!";
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
              className={`input max-w-full bg-inherit text-black ${formState.inputLabel}`}
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <label className="form-label">
              <span className={`form-label-alt ${formState.spanLabel}`}>
                {formState.text}
              </span>
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
      <div className="mx-auto flex w-full max-w-xl lg:max-w-4xl px-2 mb-12 flex-col gap-3 md:gap-4 pt-8 pb-24">
        <h2 className="text-xl font-semibold">Seznam úkolů</h2>
        {tasks
          .filter((oneTask) => !oneTask.status)
          .map((oneTask) => (
            <Task
              key={oneTask.id}
              taskText={oneTask.text}
              change={() => handleChange(oneTask.id)}
              status={oneTask.status}
              deleteTask={() => handleDelete(oneTask.id)}
              modal="modal-edit"
              editTask={() => handleEditBtn(oneTask.id)}
            />
          ))}

        <h2 className="text-xl font-semibold mt-12">Dokončeno</h2>
        {tasks
          .filter((oneTask) => oneTask.status)
          .map((oneTask) => (
            <Task
              key={oneTask.id}
              taskText={oneTask.text}
              change={() => handleChange(oneTask.id)}
              status={oneTask.status}
              deleteTask={() => handleDelete(oneTask.id)}
              modal="modal-edit"
              editTask={() => handleEditBtn(oneTask.id)}
            />
          ))}
      </div>

      {/* <label className="btn btn-outline-warning btn-xs" htmlFor="modal-edit">
        Edit new
      </label> */}
      <input className="modal-state" id="modal-edit" type="checkbox" />
      <div className="modal">
        <label className="modal-overlay" htmlFor="modal-edit"></label>
        <div className="modal-content flex flex-col gap-5 bg-white">
          <div className="form-group">
            <div className="form-field">
              <label className="form-label text-gray-700">Upravte úkol</label>

              <input
                placeholder="Zadejte úkol"
                type="text"
                className="input max-w-full bg-inherit text-black"
                onChange={(e) => setEditValue(e.target.value)}
                value={editValue}
              />
              <label className="form-label">
                <span className="form-label-alt">Neplatný formát</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <label
              onClick={() => handleSave(tempID)}
              className="btn btn-success btn-block"
              htmlFor="modal-edit"
            >
              Uložit
            </label>

            <label
              htmlFor="modal-edit"
              className="btn btn-block bg-gray-200 text-black"
            >
              Zrušit
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
