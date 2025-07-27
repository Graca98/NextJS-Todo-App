"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoFilterSharp } from "react-icons/io5";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { FaStar, FaClock, FaCalendarDay, FaListAlt, FaCheckCircle } from 'react-icons/fa';
import TaskPage from "./TaskPage";
import { useSwipeable } from 'react-swipeable';
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"

import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



export default function Sidebar() {
  const [openSide, setOpenSide] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  const { toast } = useToast()

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/collections");
      if (!res.ok) throw new Error('Chyba při načítání kolekcí');
      const data = await res.json();
      setCollections(data);
      if (data.length > 0) setSelectedCollectionId(data[0].id);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpenSide(true);
    }
  }, []);

  // Použití i v jiných funkcích:
  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) return;
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCollectionName.trim() }),
    });
    toast({
      title: "Kolekce přidána",
      description: `Kolekce "${newCollectionName}" byla úspěšně vytvořena.`,
    });
    setNewCollectionName("");
    await fetchCollections();
  };

  const handleDeleteCollection = async (id) => {
    await fetch(`/api/collections?id=${id}`, {
      method: "DELETE",
    });
    toast({
      title: "Kolekce smazána",
      description: `Kolekce byla odstraněna.`,
      variant: "destructive",
    })
    await fetchCollections();
  };

  const handleEditCollection = async (id) => {
    if (!editName.trim()) return;
    await fetch("/api/collections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName.trim() }),
    });
    toast({
      title: "Kolekce upravena",
      description: `Název kolekce byl změněn`
    });
    setEditId(null);
    setEditName("");
    await fetchCollections();
  };

  // TEST
  const filters = [
    { id: 'important', name: 'Důležité', icon: <FaStar className="text-yellow-400" /> },
    { id: 'overdue', name: 'Po splatnosti', icon: <FaClock className="text-red-500" /> },
    { id: 'today', name: 'Dnes', icon: <FaCalendarDay className="text-blue-500" /> },
    { id: 'all', name: 'Všechny úkoly', icon: <FaListAlt className="text-gray-500" /> },
    { id: 'completed', name: 'Dokončené', icon: <FaCheckCircle className="text-green-500" /> },
  ];


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddCollection();
    }
    if (e.key === "Escape") {
      setNewCollectionName("")
    }
  };

  const handleEditKeyDown = (e) => {
    if (!editId) return;
    if (e.key === "Enter") {
      handleEditCollection(editId);
    }
    if (e.key === "Escape") {
      setEditId(null);
    }
  };
  
  // Funkce na ovládaní sidebaru swipem
  const handlers = useSwipeable({
    onSwipedRight: () => setOpenSide(true),
    onSwipedLeft: () => setOpenSide(false),
    delta: 50,
  });
  
  return (
    <>
      <div {...handlers} className="bg-card flex flex-col sm:overflow-hidden">
        <div className="lg:mx-auto flex w-full min-h-dvh">
          {/* Sidebar */}
          <div className="relative z-[90]">
            <div
              {...handlers}
              tabIndex="0"
              className={`${
                openSide
                  ? "fixed w-full sm:relative sm:w-[200px] lg:w-[290px]"
                  : "hidden"
              } top-0 z-40 flex flex-col h-full overflow-y-auto bg-background text-foreground focus:outline-0 sm:max-w-[290px] duration-500`}
            >
              <div className="flex-1 px-4 md:px-6">
                <div className="flex items-center mb-2 mt-4 h-10">
                  <RxHamburgerMenu
                    onClick={() => setOpenSide(false)}
                    className={`${!openSide && "hidden"} text-xl`}
                  />
                </div>

                {/*todo User - do budoucna */}
                {/* <div className="flex items-center">
                  <h2>User 1</h2>
                  <div className="border rounded-full p-2 ml-2">
                    <Image
                      src="/next.svg"
                      width={32}
                      height={32}
                      alt="user image"
                    />
                  </div>
                </div> */}

                {/* Filtry */}
                <h3 className="mt-6 mb-2 text-sm text-foreground uppercase">Filtry</h3>
                <ul className="space-y-2">
                  {filters.map((filter) => (
                    <li key={filter.id} className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => {
                      setSelectedFilter(filter.id);
                      setSelectedCollectionId(null);
                      setSelectedCollectionName(filter.name);
                    }}>
                      <span>{filter.icon}</span>
                      <span>{filter.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider mt-4" />
                
                {/* Přidání nové kolekce */}
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Název kolekce"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border p-2 w-full text-sm"
                  />
                  <button
                    onClick={handleAddCollection}
                    className="bg-blue-500 text-white mt-2 py-2 px-4 rounded text-sm w-full"
                  >
                    Přidat kolekci
                  </button>
                </div>

                <div className="divider mt-4" />

                <ul className="mt-4 space-y-2">
                  {collections.map((col) => (
                    <li
                      key={col.id}
                      className="flex items-center justify-between p-1"
                    >
                      {editId === col.id ? (
                        <>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="border p-1 text-sm w-2/3"
                          />
                          <div className="flex gap-1">
                            <FiCheck
                              onClick={() => handleEditCollection(col.id)}
                              className="cursor-pointer text-green-600"
                            />
                            <FiX
                              onClick={() => setEditId(null)}
                              className="cursor-pointer text-red-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <span
                            onClick={() => {
                              setSelectedCollectionId(col.id);
                              setSelectedCollectionName(col.name);
                              setSelectedFilter(null);
                            }}
                            className="cursor-pointer hover:underline w-2/3"
                          >
                            {col.name}
                          </span>
                          <div className="flex gap-2">
                            <FiEdit2
                              onClick={() => {
                                setEditId(col.id);
                                setEditName(col.name);
                              }}
                              className="cursor-pointer text-gray-500"
                            />

                            {/* Delete button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                              <span className="cursor-pointer text-red-500">
                                <FiTrash2 title="Smazat kolekci" />
                              </span>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-foreground">{`Opravdu chceš smazat kolekci "${col.name}"?`}</AlertDialogTitle>
                                  <AlertDialogDescription className="text-foreground">
                                    Tato akce je nevratná. Všechny úkoly v této kolekci budou nenávratně odstraněny.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="text-foreground">Zrušit</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCollection(col.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Smazat
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>

          {/* Vlastní obsah vpravo */}
          <div className="flex flex-col w-full mx-4 md:mx-6 text-foreground">
            {/* Titulek */}
            <div className="flex flex-col mb-8 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RxHamburgerMenu
                    onClick={() => setOpenSide(true)}
                    className={`${openSide && "hidden"} text-xl`}
                  />
                  <h1 className={`text-2xl text-foreground font-semibold px-2 py-1.5 ${openSide ? "pl-0" : "ml-4"}`}>
                    {selectedCollectionName || "Todo App"}
                  </h1>
                </div>
                <div>
                  <div className="hidden md:inline-flex ">
                    <ThemeSwitcher className=""/> 
                  </div>
                  {/* <div className="dropdown">
                    <label
                      className="inline-flex items-center w-fit px-4"
                      tabIndex={0}
                    >
                      <IoFilterSharp className="mr-1 text-lg" />
                      Filtr
                    </label>
                    <div className="dropdown-menu dropdown-menu-bottom-left">
                    </div>
                  </div> */}
                </div>
              </div>
              <span
                className={`hidden ${openSide ? "pl-2" : "pl-7"} text-xs`}
              >
                Zde bude dnešní den, datum
              </span>
            </div>

            {/* Tady se zobrazuje TaskPage */}
            {selectedFilter ? (
              <TaskPage filter={selectedFilter} />
            ) : selectedCollectionId ? (
              <TaskPage taskID={selectedCollectionId} />
            ) : (
              <p>Vyber kolekci nebo filtr...</p>
            )}
            
            {/* Footer */}
            {/* <div className="mx-auto w-full max-w-screen-xl gap-6 pt-4 pb-2 md:pt-16 md:pb-4 px-1">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400">Aplikaci vytvořil Denis G.</p>
              </div>
            </div> */}
          </div>
        </div>

      </div>
    </>
  );
}
