"use client";

//todo Další úklid kódu
//todo Opravit filtr podle času

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskEditForm from "./TaskEditForm";
import Sidebar from "./Sidebar";
// Icons
import { IoMdAddCircle } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";

export default function TaskPage() {
  const [tempID, setTempID] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [currentTime, setCurrentTime] = useState(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [formState, setFormState] = useState({
    inputLabel: "",
    spanLabel: "",
    formText: "",
  });
  const [taskDate, setTaskDate] = useState("");
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
      task.id === id ? { ...task, status: !task.status } : task,
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

    const newTask = {
      id: uuidv4(),
      text: task,
      status: false,
      time: parseCzechDate()
      //time: currentTime,
    };

    console.log(`Task byl přidán: ${currentTime}`);

    setTasks([...tasks, newTask]);
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
      one.id === id ? { ...one, text: editValue } : one,
    );

    setTasks(editedTasks);
    setEditValue("");
    setOpenEditModal(false);
  };

  useEffect(() => {
    let date = new Date();

    // Dnešní datum
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let czMonths = [
      "ledna",
      "února",
      "března",
      "dubna",
      "května",
      "června",
      "července",
      "srpna",
      "září",
      "října",
      "listopadu",
      "prosince",
    ];
    let year = date.getFullYear();

    let formattedDate = `${day}. ${czMonths[month]} ${year}`;

    // Aktuální čas
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Formátování hodin a minut s předponou 0, pokud je hodnota menší než 10
    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Formátování času
    let formattedTime = `${formattedHours}:${formattedMinutes}`;
    const resultTime = `${formattedDate} v ${formattedTime}`;
    setCurrentTime(resultTime);
  }, [handleSubmit]);

  {
    /* =========================== Filters ================================= */
  }

  function sortByTimeOldest() {
    console.log("Seřazuji podle času");
    const sortedTasks = [...tasks].sort((a, b) => {
      let dateA = parseCzechDateTime(a.time).getTime();
      let dateB = parseCzechDateTime(b.time).getTime();
      return dateA - dateB;
    });
    setTasks(sortedTasks);
  }
  function sortByTimeNewest() {
    console.log("Seřazuji podle času");
    const sortedTasks = [...tasks].sort((a, b) => {
      let dateA = parseCzechDateTime(a.time).getTime();
      let dateB = parseCzechDateTime(b.time).getTime();
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
      const czDate = `${day}.${month}.${year}`;
      return czDate;
    }
  }

  //todo Odstranit funkci
  function parseCzechDateTime(czechDateTime: string) {
    const monthNames = {
      ledna: 0,
      února: 1,
      března: 2,
      dubna: 3,
      května: 4,
      června: 5,
      července: 6,
      srpna: 7,
      září: 8,
      října: 9,
      listopadu: 10,
      prosince: 11,
    };

    // Odstranění přípony a rozdělení na datum a čas
    const parts = czechDateTime.split(" v ");
    const dateParts = parts[0].trim().split(" ");
    const timeParts = parts[1].trim().split(":");

    // Extrahování jednotlivých částí
    let day = parseInt(dateParts[0], 10);
    let month = monthNames[dateParts[1]];
    let year = parseInt(dateParts[2], 10);
    let hours = parseInt(timeParts[0], 10);
    let minutes = parseInt(timeParts[1], 10);

    // Vytvoření nového objektu Date
    return new Date(year, month, day, hours, minutes);
  }

  return (
    <div className="background flex flex-col">
      <div className="lg:mx-auto flex w-full min-h-dvh max-w-screen-xl">
        {/* Sidebar */}
        <Sidebar openSide={openSide} setOpenSide={setOpenSide} />
        {/*<div
          className={`hidden ${
            openSide ? "w-72" : "w-14"
          } relative duration-300 bg-white flex flex-col px-2 gap-3 mr-1 md:mr-4 md:gap-4 pt-2 `}
        >
          <button
            onClick={() => setOpenSide(!openSide)}
            className={`absolute -right-5 top-4 btn btn-outline text-black bg-white rounded-full w-fit px-2 gap-1 mb-4 md:mb-2`}
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
          <button
            className="inline-flex items-center cursor-pointer w-fit"
            onClick={() => setOpenTaskModal(true)}
            // htmlFor="modal-newTask"
          >
            <IoMdAddCircle className="text-4xl w-10 h-10 shrink-0 rounded block float-left mr-2" />
            <span
              className={`${
                !openSide && "scale-0"
              } shrink-0 duration-300 origin-left align-middle items-center`}
            >
              Přidan nový
            </span>
          </button>
          <button
            className="inline-flex items-center cursor-pointer w-fit"
            onClick={() => setOpenTaskModal(true)}
            // htmlFor="modal-newTask"
          >
            <IoMdAddCircle className="text-4xl w-10 h-10 shrink-0 rounded block float-left mr-2" />
            <span
              className={`${
                !openSide && "scale-0"
              } shrink-0 duration-300 origin-left align-middle items-center`}
            >
              Přidan nový
            </span>
          </button>
        </div>*/}

        <div className="flex flex-col w-full">
          {/* Titulek */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-semibold mt-4">Todo App</h1>
            <p className="text-sm">NextJs ukolníček</p>
            <button
              onClick={() => setOpenSide(true)}
              className="btn btn-success"
            >
              Otevřit sidebar
            </button>
          </div>

          <div className="flex justify-between px-2">
            <button
              className="btn btn-primary pl-[9px] pr-3 inline-flex items-center w-fit"
              onClick={() => setOpenTaskModal(true)}
              // htmlFor="modal-newTask"
            >
              <IoMdAddCircle className="text-2xl mr-0.5" />
              Přidat úkol
            </button>

            <div className="dropdown">
              <label
                className="btn btn-solid-primary inline-flex items-center w-fit px-4"
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
                <a onClick={sortByTimeOldest} className="dropdown-item text-sm">
                  Čas od nejstaršího{" "}
                  <span className="text-stone-400">(Default)</span>
                </a>
                <a onClick={sortByTimeNewest} className="dropdown-item text-sm">
                  Čas od nejnovějšího
                </a>
              </div>
            </div>
          </div>
          {/* Seznam úkolů */}
          <div className="flex flex-col px-2 gap-3 md:gap-4 pt-2 w-full mb-12">
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
      {/* Modal na přidání tasku */}
      <TaskForm
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
