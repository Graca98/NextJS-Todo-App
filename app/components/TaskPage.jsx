"use client";

//todo Další úklid kódu
//todo Opravit filtr podle času

import { useState, useEffect, useCallback } from "react";
import { supabase } from '../../lib/supabaseClient.js';
import useIsMobile from "../../lib/hooks/useIsMobile.js";
import TaskList from "./TaskList.jsx";
import TaskEditForm from "./TaskEditForm.jsx";
import AddTask from "./AddTask.jsx";

// Icons
import { IoFilterSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function TaskPage({ taskID, filter }) {
  const [editTaskId, setEditTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const isMobile = useIsMobile();
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
      let queryBuilder = supabase
        .from('tasks')
        .select('*, collections(id, user_id)')
        .order('created_at', { ascending: false });
  
      if (filter) {
        if (filter === 'important') {
          queryBuilder = queryBuilder.eq('important', true);
        } else if (filter === 'overdue') {
          queryBuilder = queryBuilder.lt('due_date', new Date().toISOString()).eq('is_completed', false);
        } else if (filter === 'today') {
          const today = new Date().toISOString().split('T')[0];
          queryBuilder = queryBuilder.eq('due_date', today).eq('is_completed', false);
        } else if (filter === 'completed') {
          queryBuilder = queryBuilder.eq('is_completed', true);
        }
      } else if (taskID) {
        queryBuilder = queryBuilder.eq('collection_id', taskID);
      } else {
        setTasks([]);
        return;
      }
  
      // Filtrujeme přes kolekci - user_id 1
      queryBuilder = queryBuilder.eq('collections.user_id', 1);
  
      const { data, error } = await queryBuilder;
      if (error) throw error;
  
      // Supabase vrací objekty s embedded `collections`, pokud připojíš join
      const filteredTasks = data.filter(task => task.collections?.user_id === 1);
  
      setTasks(filteredTasks ?? []);
    } catch (error) {
      console.error("Chyba při načítání úkolů:", error);
      setTasks([]);
    }
  }, [taskID, filter]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (isMobile && editTaskId !== null && !openEditModal) {
      setEditTaskId(null);
    }
    if (!isMobile && openEditModal) {
      setOpenEditModal(false);
    }
  }, [isMobile, editTaskId, openEditModal]);
  
  // Změní status (true/false) tasku při kliknutí na checkbox
  const handleChange = async (id) => {
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
  const handleDelete = async (id) => {
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
  const handleEditBtn = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setEditTaskId(id);
    setEditValue(task.name);
  
    if (isMobile) {
      setOpenEditModal(true);
    }
  };
  

  const handleEditSave = async () => {
    try {
      await supabase.from("tasks").update({ name: editValue }).eq("id", editTaskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === editTaskId ? { ...t, name: editValue } : t))
      );
      setEditTaskId(null);
      setEditValue("");
      setOpenEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleEditCancel = () => {
    setEditTaskId(null);
    setEditValue("");
    setOpenEditModal(false);
  };

  // Vybere veškerý text při kliknutí na edit input
  const handleFocus = (event) => event.target.select();
  // const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  // Save button v edit modalu
  // const handleEdit = async (id) => {
  //   try {
  //     const res = await fetch(`/api/tasks/${id}`, {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name: editValue })
  //     });
  //     if (!res.ok) throw new Error('Chyba při úpravě úkolu');      
  
  //     // Lokálně upraví úkol
  //     const editedTasks = tasks.map((one) =>
  //       one.id === id ? { ...one, name: editValue } : one
  //     );
  //     setTasks(editedTasks);
  //     setEditValue("");
  //     setOpenEditModal(false);
  //   } catch (error) {
  //     console.error("Chyba při mazání úkolu:", error);
  //   }

  // };

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

      {!filter && !taskID && (
        <p className="text-gray-500">Vyber kolekci nebo filtr...</p>
      )}

      {/* Seznam úkolů */}
      <div className="flex flex-col gap-3 md:gap-4 pt-2 w-full mb-12">
      <TaskList
        tasks={tasks}
        handleChange={handleChange}
        handleDelete={handleDelete}
        handleEditBtn={handleEditBtn}
        editTaskId={editTaskId}
        editValue={editValue}
        setEditValue={setEditValue}
        handleEditSave={handleEditSave}
        handleEditCancel={handleEditCancel}
        isMobile={isMobile}
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
        handleEdit={handleEditSave}
      />
    </div>
  );
}
