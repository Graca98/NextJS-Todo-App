"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";
// Icons
import { IoMdAddCircle } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";

export default function TaskPage() {
  const [tempID, setTempID] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [formState, setFormState] = useState({
    inputLabel: "",
    spanLabel: "",
    formText: "",
  });
  const [task, setTask] = useState("Tohle je testovací úkol :)");
  const [editValue, setEditValue] = useState("");

  // Sidebar useState
  const [openSide, setOpenSide] = useState(false);

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
  const handleChange = (id: number) => {
    let handleStatus = tasks.map((task) =>
      task.id === id ? { ...task, status: !task.status } : task
    );

    setTasks(handleStatus);
  };

  // Smaže vybraný task
  const handleDelete = (id: number) => {
    let newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  // Po kliknutí na edit button se načte value daného úkolu
  const handleEditBtn = (id: number) => {
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
  const handleSave = (id: number) => {
    const editedTasks = tasks.map((one) =>
      one.id === id ? { ...one, text: editValue } : one
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
        formText: "Input nemůže být prázdný",
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
    setTask("Tohle je taky testovací úkol :))");
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
  };

  // Zpracuje klávesu Enter při přidávání nového tasku
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="background flex flex-col">
      <div className="lg:mx-auto flex w-full min-h-dvh max-w-screen-xl">
        {/* Sidebar */}
        <div
          className={`${
            openSide ? "w-72" : "w-14"
          } relative duration-300 bg-white flex flex-col px-2 gap-3 mr-1 md:mr-4 md:gap-4 pt-2`}
        >
          <button
            onClick={() => setOpenSide(!openSide)}
            className={`absolute -right-5 top-4 btn btn-outline text-black hover:text-white bg-white rounded-full w-fit px-2 gap-1 mb-4 md:mb-2`}
          >
            <FaArrowLeft
              className={`text-xl duration-500  ${!openSide && "rotate-180"} `}
            />
          </button>
          <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
          <label
            className="inline-flex items-center cursor-pointer w-fit"
            htmlFor="modal-newTask"
          >
            <IoMdAddCircle className="text-4xl w-10 h-10 shrink-0 rounded block float-left mr-2" />
            <h2
              className={`${
                !openSide && "scale-0"
              } shrink-0 duration-300 origin-left align-middle items-center`}
            >
              Přidan nový
            </h2>
          </label>
          {/* <label
            className="btn btn-primary w-fit px-3 gap-1 mb-4 md:mb-2"
            htmlFor="modal-newTask"
          >
            <IoMdAddCircle className="text-2xl" />
            <span className={`${!openSide && "scale-0 hidden"} duration-300`}>
              Přidat nový
            </span>
          </label> */}
        </div>

        <div className="flex flex-col w-full">
          {/* Titulek */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-semibold">Todo App</h1>
            <p className="text-sm">NextJs ukolníček</p>
          </div>

          {/* Seznam úkolů */}
          <div className="flex flex-col px-2 gap-3 md:gap-4 pt-2 w-full">
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
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white mx-auto w-full max-w-screen-xl gap-6 pt-6 pb-4 md:pt-12 md:pb-8 px-1">
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-600">Aplikaci vytvořil Denis G.</p>
          <p className="text-xs text-gray-600">Všechna práva vyhrazena</p>
        </div>
      </div>

      {/* ================================================================================================ */}

      {/* Modal na edit tasků */}
      <input className="modal-state" id="modal-edit" type="checkbox" />
      <div className="modal px-0">
        <label className="modal-overlay" htmlFor="modal-edit"></label>
        <div className="modal-content flex flex-col w-screen md:w-6/12 max-w-screen-sm gap-5 bg-white">
          <div className="form-group">
            <div className="form-field">
              <label className="form-label text-lg text-gray-700">
                Upravte úkol
              </label>
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
      <div className="modal px-0">
        <label className="modal-overlay" htmlFor="modal-newTask"></label>
        <div className="modal-content flex flex-col w-screen md:w-9/12 max-w-screen-sm gap-5 bg-white mb-40 md:mb-96">
          <div className="form-group">
            <div className="form-field">
              <label className="form-label text-lg text-gray-700">
                Zadejte úkol
              </label>
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
                  // type="button"
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
