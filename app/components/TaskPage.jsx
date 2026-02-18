"use client";

//todo Další úklid kódu
//todo Opravit filtr podle času

import { useState, useEffect, useCallback } from "react";
import { supabase } from '../../lib/supabaseClient.js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { cs } from "date-fns/locale"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import useIsMobile from "../../lib/hooks/useIsMobile.js";
import TaskList from "./TaskList.jsx";
import TaskEditForm from "./TaskEditForm.jsx";
import AddTaskFAB from "./AddTaskFAB.jsx"

// Icons
import { IoFilterSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function TaskPage({ taskID, filter, isLoadingCollections }) {
  const [editTaskId, setEditTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const isMobile = useIsMobile();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editDate, setEditDate] = useState(null);
  // Skeleton
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [editValue, setEditValue] = useState("");
  const [formState, setFormState] = useState({
    inputLabel: "",
    spanLabel: "",
    formText: "",
  });
  const [taskDate, setTaskDate] = useState("");
  const [openEditSheet, setOpenEditSheet] = useState(false)
  const { toast } = useToast()
  // Sidebar useState
  // const [openSide, setOpenSide] = useState(false);

  // Načte úkoly z mysql database
  const fetchData = useCallback(async () => {
    setIsLoadingTasks(true);

    const start = performance.now();
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
      toast({
        title: "Chyba při načítání úkolů",
        description: "Nepodařilo se načíst úkoly. Zkus to prosím znovu.",
        variant: "destructive",
      })
      const end = performance.now();
      console.log(`📦 fetchData trvalo: ${Math.round(end - start)} ms`);
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [taskID, filter, toast]);
  
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

      toast({
        title: newStatus ? "Úkol dokončen" : "Úkol vrácen zpět",
        description: `Úkol "${taskToUpdate.name}" byl ${newStatus ? "označen jako hotový" : "označen jako nedokončený"}.`,
      })

    } catch (error) {
      console.error("Chyba při změně stavu úkolu:", error)
      toast({
        title: "Chyba",
        description: "Nepodařilo se aktualizovat stav úkolu.",
        variant: "destructive",
      })
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

      toast({
        title: "Úkol smazán",
        description: `Úkol byl odstraněn.`,
        variant: "destructive",
      })

    } catch (error) {
      console.error("Chyba při mazání úkolu:", error);
      toast({
        title: "Chyba při mazání",
        description: "Úkol se nepodařilo odstranit.",
        variant: "destructive",
      })
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

    const start = performance.now();

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error('Chyba při přidávání úkolu');
      const result = await res.json();

      setTasks((prev) => [result.task, ...prev])

      toast({
        title: "Úkol přidán",
        description: `Úkol "${newTask.name}" byl přidán.`,
      })

      console.log("✅ Výsledek z API:", result); 

    } catch (error) {
      console.error(error)
      toast({
        title: "Chyba při přidání úkolu",
        description: "Úkol se nepodařilo vytvořit.",
        variant: "destructive",
      })
    }

    const end = performance.now(); // ⏱️ konec měření
    console.log(`⏱️ Přidání úkolu (API + fetchData) trvalo: ${Math.round(end - start)} ms`);

    // await fetchData()

    setTask("");
    setTaskDate("");
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
    setOpenTaskModal(false);
  }, [task, taskDate, fetchData, taskID, toast]);

 const handleEditBtn = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  setEditTaskId(id);
  setEditValue(task.name);
  setEditDate(task.due_date);

  if (isMobile) {
    setOpenEditSheet(true);
  }
};

  

 const handleEditSave = async () => {
  try {
    await supabase
      .from("tasks")
      .update({
        name: editValue,
        due_date: editDate || null,
      })
      .eq("id", editTaskId);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === editTaskId
          ? { ...t, name: editValue, due_date: editDate }
          : t
      )
    );

    setEditTaskId(null);
    setEditValue("");
    setEditDate(null);

    if (isMobile) {
  setOpenEditSheet(false);
}


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
        <AddTaskFAB
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

      {isMobile && (
  <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
    <SheetContent side="bottom" className="rounded-t-2xl pb-10 px-4">
      <SheetHeader>
        <SheetTitle>Upravit úkol</SheetTitle>
      </SheetHeader>

      <div className="mt-6 flex flex-col gap-5">

        {/* INPUT */}
        <Input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full"
        />

        {/* DATUM */}
        <EditDatePicker
          editDate={editDate}
          setEditDate={setEditDate}
        />

        {/* BUTTONS */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleEditSave}
          >
            Uložit
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpenEditSheet(false)}
          >
            Zrušit
          </Button>
        </div>

      </div>
    </SheetContent>
  </Sheet>
)}


      {!isLoadingCollections && !isLoadingTasks && !filter && !taskID && (
        <p>Vyber kolekci nebo filtr...</p>
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
        isLoading={isLoadingTasks}
        isLoadingTasks={isLoadingTasks}
        isLoadingCollections={isLoadingCollections}
        editDate={editDate}
        setEditDate={setEditDate}
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

function EditDatePicker({ editDate, setEditDate }) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  today.setHours(0,0,0,0)

  const handleSelect = (date) => {
    if (!date) return
    if (date < today) return

    setEditDate(date.toISOString().split("T")[0])
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="justify-between w-full"
        >
          {editDate
            ? format(new Date(editDate), "dd. MM. yyyy", { locale: cs })
            : "Datum"}

          {editDate ? (
            <span
              onClick={(e) => {
                e.stopPropagation()
                setEditDate(null)
              }}
              className="ml-2 text-muted-foreground cursor-pointer"
            >
              ✕
            </span>
          ) : (
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-3 space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleSelect(today)}
          >
            Dnes
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              handleSelect(addDays(today, 1))
            }
          >
            Zítra
          </Button>
        </div>

        <Calendar
          mode="single"
          selected={editDate ? new Date(editDate) : undefined}
          onSelect={handleSelect}
          disabled={(date) => date < today}
        />
      </PopoverContent>
    </Popover>
  )
}
