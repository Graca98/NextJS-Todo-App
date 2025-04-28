"use client";

//todo Další úklid kódu
//todo Opravit filtr podle času

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import TaskList from "./TaskList";
import TaskEditForm from "./TaskEditForm";
import Sidebar from "./Sidebar";
import AddTask from "./AddTask";

// Icons
import { IoFilterSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function TaskPage({taskID}) {
  const [editTaskId, setEditTaskId] = useState(null);
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
  // Sidebar useState
  // const [openSide, setOpenSide] = useState(false);

  // Načte úkoly z mysql database
  // Načte úkoly z mysql database
const fetchData = useCallback(async () => {
  try {
    const collectionId = taskID; 
    const data = await fetch(`/api/tasks?collection_id=${collectionId}`);
    const response = await data.json();
    setTasks(response ?? []);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}, [taskID]);


  // const fetchData = useCallback(async () => {
  //   try {
  //     const data = await fetch('/api/tasks')
  //     const response = await data.json()
  //     setTasks(response ?? "")
  //     console.log(response)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Změní status (true/false) tasku při kliknutí na checkbox
  const handleChange = async (id: number) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id)
      if (!taskToUpdate) return
  
      const newStatus = !taskToUpdate.is_completed
  
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: newStatus })
      })
  
      // Lokálně aktualizujeme stav v UI
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, is_completed: newStatus } : task
      )
  
      setTasks(updatedTasks)
    } catch (error) {
      console.error("Chyba při změně stavu úkolu:", error)
    }

  };

  // Smaže vybraný task
  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
  
      // Lokálně vymaže úkol ze stavu
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
    } catch (error) {
      console.error("Chyba při mazání úkolu:", error);
    }
  };

  // Vytvoří úkol
  const handleSubmit = useCallback(async () => {
    if (task.trim() === "") {
      return;
    } else if (task.length > 100) {
      setFormState({
        inputLabel: "input-error",
        spanLabel: "text-error",
        formText: `Úkol je příliš dlouhý (${task.length}/100)`,
      });
      return;
    }

    const newTask = {
      collection_id: taskID,
      name: task.trim(),
      due_date: taskDate || null,
      important: false,
      priority: 'medium',
      reminder_at: null
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      const result = await res.json()
      console.log(result)
    } catch (error) {
      console.error(error)
    }

    fetchData()

    setTask("");
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
    setOpenTaskModal(false);
  }, [task, taskDate, fetchData, taskID]);

  // Po kliknutí na edit button se načte value daného úkolu
  const handleEditBtn = (id: number) => {
    setEditTaskId(id);
    tasks.map((task) => {
      if (task.id === id) {
        setEditValue(task.name);
      }
    });
  };

  // Vybere veškerý text při kliknutí na edit input
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  // Save button v edit modalu
  const handleEdit = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue })
      })
  
      // Lokálně upraví úkol
      const editedTasks = tasks.map((one) =>
        one.id === id ? { ...one, name: editValue } : one
      );
      setTasks(editedTasks);
      setEditValue("");
      setOpenEditModal(false);
    } catch (error) {
      console.error("Chyba při mazání úkolu:", error);
    }

  };

  {
    /* =========================== Filters ================================= */
  }
  //todo Opravit filtry na sql dotazy

  function sortByTimeOldest() {
    console.log("Seřazuji podle času");
    const sortedTasks = [...tasks].sort((a, b) => {
      let dateA = new Date(a.timeAdded).getTime();
      let dateB = new Date(b.timeAdded).getTime();
      return dateA - dateB;
    });
    setTasks(sortedTasks);
  }
  function sortByTimeNewest() {
    console.log("Seřazuji podle času");
    const sortedTasks = [...tasks].sort((a, b) => {
      let dateA = new Date(a.timeAdded).getTime();
      let dateB = new Date(b.timeAdded).getTime();
      return dateB - dateA;
    });
    setTasks(sortedTasks);
  }

  function sortAlphabeticallyAsc() {
    console.log("Seřazuji podle abecedy");
    const sortedTasks = [...tasks].sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    setTasks(sortedTasks);
  }
  function sortAlphabeticallyDesc() {
    console.log("Seřazuji podle abecedy");
    const sortedTasks = [...tasks].sort((a, b) => {
      return b.title.localeCompare(a.title);
    });
    setTasks(sortedTasks);
  }

  return (
    <div>
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

      {/* =========================== Modals ================================= */}
      {/* Modal na edit tasků */}
      <TaskEditForm
        editTaskId={editTaskId}
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
