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
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks?collection_id=${taskID}`);
      if (!res.ok) throw new Error('Chyba při načítání úkolů');
      const response = await res.json();
      setTasks(response ?? []);
      console.log(response);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }, [taskID]);

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
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Chyba při mazání úkolu');

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
      });
      if (!res.ok) throw new Error('Chyba při přidávání úkolu');
      const result = await res.json();
      console.log(result);      
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
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue })
      });
      if (!res.ok) throw new Error('Chyba při úpravě úkolu');      
  
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

      {/* Tlačítko "+" na mobilním zobrazení, které ma přidat ukol */}
      {/*todo Možná vratit modal na přidání ukolu na telefonu? */}
      {/* <button 
        onClick={() => setOpenTaskModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-600 md:hidden"
      >
        +
      </button> */}


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
