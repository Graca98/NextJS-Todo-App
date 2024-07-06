"use client";

//todo Další úklid kódu

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskEditForm from "./TaskEditForm";
// Icons
import { IoMdAddCircle } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";

export default function TaskPage() {
  const [tempID, setTempID] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [formState, setFormState] = useState({
    inputLabel: "",
    spanLabel: "",
    formText: "",
  });
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

  // Vytvoří nový task
  const handleSubmit = () => {
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
    setTask("");
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
    setOpenTaskModal(false);
  };

  // Po kliknutí na edit button se načte value daného úkolu
  const handleEditBtn = (id: number) => {
    setTempID(id);
    tasks.map((one) => {
      if (one.id === id) {
        setEditValue(one.text);
      }
    });
  };

  // Vybere veškerý text při kliku na edit input
  const handleFocus = (event) => event.target.select();

  // Save button v edit modalu
  const handleEdit = (id: number) => {
    const editedTasks = tasks.map((one) =>
      one.id === id ? { ...one, text: editValue } : one
    );

    setTasks(editedTasks);
    setEditValue("");
    setOpenEditModal(false);
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
          <h2
            className={`text-xl font-semibold mb-4 ${!openSide && "invisible"}`}
          >
            Sidebar
          </h2>
          <label
            className="inline-flex items-center cursor-pointer w-fit"
            onClick={() => setOpenTaskModal(true)}
            // htmlFor="modal-newTask"
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
        </div>

        <div className="flex flex-col w-full">
          {/* Titulek */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-semibold">Todo App</h1>
            <p className="text-sm">NextJs ukolníček</p>
          </div>

          {/* Seznam úkolů */}
          <div className="flex flex-col px-2 gap-3 md:gap-4 pt-2 w-full mb-12">
            <TaskList
              tasks={tasks}
              handleChange={handleChange}
              handleDelete={handleDelete}
              handleEditBtn={handleEditBtn}
            />
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
      {/* Modal na přidání tasku */}
      <TaskForm
        openTaskModal={openTaskModal}
        setOpenTaskModal={setOpenTaskModal}
        formState={formState}
        setFormState={setFormState}
        task={task}
        setTask={setTask}
        handleSubmit={handleSubmit}
      />

      {/* Modal na edit tasků */}
      <TaskEditForm
        tempID={tempID}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        editValue={editValue}
        setEditValue={setEditValue}
        handleFocus={handleFocus}
        handleEdit={handleEdit}
      />
    </div>
  );
}
