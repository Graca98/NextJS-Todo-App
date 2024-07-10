"use client";

//todo Další úklid kódu
//todo Opravit filtr podle času

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TaskList from "./TaskList";
import TaskEditForm from "./TaskEditForm";
import Sidebar from "./Sidebar";
import AddTask from "./AddTask";
// Icons
import { IoFilterSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

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
  const [taskDate, setTaskDate] = useState("");
  const [time, setTime] = useState("");
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
    if (newTasks.length === 0) {
      localStorage.removeItem("tasks");
      setTasks([]);
      return;
    }
    setTasks(newTasks);
  };
  // Vytvoří nový task
  const handleSubmit = () => {
    if (task.trim() === "") {
      // setFormState({
      //   inputLabel: "input-error",
      //   spanLabel: "text-error",
      //   formText: "Název úkolu nesmí být prázdný",
      // });
      return;
    } else if (task.length > 100) {
      setFormState({
        inputLabel: "input-error",
        spanLabel: "text-error",
        formText: `Zadaný úkol je příliš dlouhý (${task.length}/100)`,
      });
      return;
    }

    const newTask = {
      id: uuidv4(),
      text: task.trim(),
      status: false,
      time: parseCzechDate(),
      added: time,
      //time: currentTime,
    };

    setTasks([newTask, ...tasks]);
    setTask("");
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
    setTaskDate("");
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

  {
    /* =========================== Filters ================================= */
  }

  function sortByTimeOldest() {
    console.log("Seřazuji podle času");
    const sortedTasks = [...tasks].sort((a, b) => {
      let dateA = new Date(a.added).getTime();
      let dateB = new Date(b.added).getTime();
      return dateA - dateB;
    });
    setTasks(sortedTasks);
  }
  function sortByTimeNewest() {
    console.log("Seřazuji podle času");
    const sortedTasks = [...tasks].sort((a, b) => {
      let dateA = new Date(a.added).getTime();
      let dateB = new Date(b.added).getTime();
      return dateB - dateA;
    });
    setTasks(sortedTasks);
  }

  function sortAlphabeticallyAsc() {
    console.log("Seřazuji podle abecedy");
    const sortedTasks = [...tasks].sort((a, b) => {
      return a.text.localeCompare(b.text);
    });
    setTasks(sortedTasks);
  }
  function sortAlphabeticallyDesc() {
    console.log("Seřazuji podle abecedy");
    const sortedTasks = [...tasks].sort((a, b) => {
      return b.text.localeCompare(a.text);
    });
    setTasks(sortedTasks);
  }

  function parseCzechDate() {
    const dateInput = taskDate;
    if (dateInput) {
      const [year, month, day] = dateInput.split("-");
      const czDate = `${day}. ${month}. ${year}`;
      return czDate;
    }
  }

  useEffect(() => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let formattedDay = day < 10 ? `0${day}` : day;
    let formattedMonth = month < 10 ? `0${month}` : month;
    let formattedHours = hours < 10 ? `0${hours}` : hours;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    setTime(
      `${year}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    );
  }, [handleSubmit]);

  return (
    <div className="background flex flex-col">
      <div className="lg:mx-auto flex w-full min-h-dvh">
        {/* Sidebar */}
        <Sidebar openSide={openSide} setOpenSide={setOpenSide} />

        <div className="flex flex-col w-full mx-4 md:mx-6">
          {/* Titulek */}
          <div className="flex flex-col mb-8 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <RxHamburgerMenu
                  onClick={() => setOpenSide(true)}
                  className={`${openSide && "hidden"} text-xl`}
                />
                <h1 className="text-xl font-semibold px-2 py-1.5">Todo App</h1>
              </div>
              <div>
                <div className="dropdown">
                  <label
                    className=" inline-flex items-center w-fit px-4"
                    tabIndex={0}
                  >
                    <IoFilterSharp className="mr-1 text-lg" />
                    Filtr
                  </label>
                  <div className="dropdown-menu dropdown-menu-bottom-left">
                    <a
                      onClick={sortAlphabeticallyAsc}
                      className="dropdown-item text-sm"
                    >
                      Abeceda A-Z
                    </a>
                    <a
                      onClick={sortAlphabeticallyDesc}
                      className="dropdown-item text-sm"
                    >
                      Abeceda Z-A
                    </a>
                    <a
                      onClick={sortByTimeOldest}
                      className="dropdown-item text-sm"
                    >
                      Čas od nejstaršího{" "}
                    </a>
                    <a
                      onClick={sortByTimeNewest}
                      className="dropdown-item text-sm"
                    >
                      Čas od nejnovějšího
                      <span className="text-stone-400">(Default)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <span className={`hidden ${openSide ? "pl-2" : "pl-7"} text-xs`}>
              Zde bude dnešní den, datum
            </span>
          </div>

          <div className="">
            <AddTask
              openTaskModal={openTaskModal}
              setOpenTaskModal={setOpenTaskModal}
              formState={formState}
              setFormState={setFormState}
              task={task}
              setTask={setTask}
              handleSubmit={handleSubmit}
              taskDate={taskDate}
              setTaskDate={setTaskDate}
            />
          </div>
          {/* Seznam úkolů */}
          <div className="flex flex-col gap-3 md:gap-4 pt-2 w-full mb-12">
            <TaskList
              tasks={tasks}
              handleChange={handleChange}
              handleDelete={handleDelete}
              handleEditBtn={handleEditBtn}
              setOpenEditModal={setOpenEditModal}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-screen-xl gap-6 pt-6 pb-4 md:pt-12 md:pb-8 px-1">
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-600">Aplikaci vytvořil Denis G.</p>
          {/* <p className="text-xs text-gray-600">Všechna práva vyhrazena</p> */}
        </div>
      </div>

      {/* =========================== Modals ================================= */}
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
