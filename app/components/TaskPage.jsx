'use client';

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";

export default function TaskPage() {
  const [tempID, setTempID] = useState("");
  const [tasks, setTasks] = useState([]);
  const [formState, setFormState] = useState({
    inputLabel: "",
    spanLabel: "",
    formText: "",
  });
  const [task, setTask] = useState("");
  const [editValue, setEditValue] = useState("");

  // Načte úkoly z localStorage při načtení komponenty
  useEffect(() => {
    const getLocalStorageTasks = () => {
      try {
        const tasks = localStorage.getItem("tasks");
        return tasks ? JSON.parse(tasks) : [];
      } catch (e) {
        console.error("Error parsing localStorage tasks", e);
        return [];
      }
    };

    const storedTasks = getLocalStorageTasks();
    setTasks(storedTasks);
  }, []);

  // Uloží úkoly do localStorage při každé změně úkolů
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Změní status (true/false) tasku při kliknutí na checkbox
  const handleChange = (id) => {
    let handleStatus = tasks.map((task) =>
      task.id === id ? { ...task, status: !task.status } : task,
    );

    setTasks(handleStatus);
  };

  // Smaže vybraný task
  const handleDelete = (id) => {
    let newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
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

  // Vybere veškerý text při kliku na edit input
  const handleFocus = (event) => event.target.select();

  // Save button v edit modalu
  const handleSave = (id) => {
    const editedTasks = tasks.map((one) =>
      one.id === id ? { ...one, text: editValue } : one,
    );

    setTasks(editedTasks);
    setEditValue("");
  };

  // Vytvoří nový task
  const handleClick = () => {
    if (task.trim() === "") {
      setFormState({
        inputLabel: "input-error",
        spanLabel: "text-error",
        formText: "Input nemůže být prázdný!",
      });
      return;
    }

    console.log("form state je: " + formState.formText);

    const newTask = {
      id: uuidv4(),
      text: task,
      status: false,
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
  };

  // Zpracuje klávesu Enter při přidávání nového tasku
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div className="background">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-4 md:py-8 px-1">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold">Todo App</h1>
          <p className="text-sm">NextJs ukolníček</p>
        </div>
      </div>

      {/* Seznam úkolů */}
      <div className="mx-auto flex w-full max-w-xl lg:max-w-4xl px-2 mb-12 flex-col gap-3 md:gap-4 pt-2 pb-24">
        <label
          className="btn btn-primary w-6/12 mx-auto md:mx-0 md:w-32 mb-4 md:mb-2"
          htmlFor="modal-newTask"
        >
          Přidat nový
        </label>
        <h2 className="text-xl font-semibold">
          {tasks.filter((oneTask) => !oneTask.status).length > 0
            ? "Seznam úkolů"
            : ""}
        </h2>
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

        <h2 className="text-xl font-semibold mt-12">
          {tasks.filter((oneTask) => oneTask.status).length > 0
            ? "Dokončeno"
            : ""}
        </h2>
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

      {/* Modal na edit tasků */}
      <input className="modal-state" id="modal-edit" type="checkbox" />
      <div className="modal">
        <label className="modal-overlay" htmlFor="modal-edit"></label>
        <div className="modal-content flex flex-col w-screen md:w-6/12 max-w-screen-sm gap-5 bg-white">
          <div className="form-group">
            <div className="form-field">
              <label className="form-label text-lg text-gray-700">Upravte úkol</label>
              <input
                placeholder="Upravte úkol"
                type="text"
                className="input max-w-full bg-white text-black"
                onChange={(e) => setEditValue(e.target.value)}
                onFocus={handleFocus}
                value={editValue}
              />
              <label className="form-label">
                <span className="form-label-alt">Neplatný formát</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 w-full mx-auto justify-center">
            <label
              onClick={() => handleSave(tempID)}
              className="btn btn-success btn-block w-32"
              htmlFor="modal-edit"
            >
              Uložit
            </label>
            <label
              htmlFor="modal-edit"
              className="btn btn-block bg-gray-200 text-black w-32"
            >
              Zrušit
            </label>
          </div>
        </div>
      </div>

      {/* Modal na přidání tasku */}
      <input className="modal-state" id="modal-newTask" type="checkbox" />
      <div className="modal">
        <label className="modal-overlay" htmlFor="modal-newTask"></label>
        <div className="modal-content flex flex-col w-screen md:w-9/12 max-w-screen-sm gap-5 bg-white">
          <div className="form-group">
            <div className="form-field">
              <label className="form-label text-lg text-gray-700">Zadejte úkol</label>
              <input
                placeholder="Vynést odpadky"
                type="text"
                className={`input max-w-full bg-white text-black ${formState.inputLabel}`}
                onKeyDown={handleKeyDown}
                onChange={(e) => setTask(e.target.value)}
                value={task}
              />
              <label className="form-label">
                <span className={`form-label-alt ${formState.spanLabel}`}>
                  {formState.formText}
                </span>
              </label>
            </div>
            <div className="form-field pt-3">
              <div className="form-control mx-auto">
                <label
                  type="button"
                  onClick={handleClick}
                  className="btn btn-primary w-32 "
                  htmlFor="modal-newTask"
                >
                  Vložit
                </label>
                <label
                  htmlFor="modal-newTask"
                  className="btn btn-block bg-gray-200 text-black w-32"
                >
                  Zrušit
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
