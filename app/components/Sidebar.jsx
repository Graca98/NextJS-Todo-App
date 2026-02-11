"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoFilterSharp } from "react-icons/io5";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiFolder } from "react-icons/fi";
import { FiPlus } from "react-icons/fi"
import { FaStar, FaClock, FaCalendarDay, FaListAlt, FaCheckCircle } from 'react-icons/fa';
import TaskPage from "./TaskPage";
import { useSwipeable } from 'react-swipeable';
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import { useSidebar, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupAction, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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



export default function SidebarComponent() {
  const [openSide, setOpenSide] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [editMode, setEditMode] = useState(false);      // globální „režim úprav“
  const [taskCounts, setTaskCounts] = useState({});     // { [collectionId]: number }
  const [showingAddInput, setShowingAddInput] = useState(false);

  const { toggleSidebar } = useSidebar()

  const { toast } = useToast()

  const fetchTaskCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks/counts?status=open')
      if (!res.ok) throw new Error('Nepodařilo se načíst počty')
      const map = await res.json()  // { [collectionId]: number }
      setTaskCounts(map)
    } catch (e) {
      console.error(e)
      setTaskCounts({})
    }
  }, [])
  
  // fetchCollections – volá agregovaný endpoint
  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/collections");
      if (!res.ok) throw new Error('Chyba při načítání kolekcí');
      const data = await res.json();
      setCollections(data);
      if (data.length > 0) setSelectedCollectionId(data[0].id);
  
      await fetchTaskCounts(); 
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }, [fetchTaskCounts]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpenSide(true);
    }
  }, []);

  useEffect(() => {
    if (!openSide) setEditMode(false);
  }, [openSide]);

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

  const closeOnMobile = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setOpenSide(false);
    }
  };
  
  
  return (
    <>
      <div {...handlers} className="bg-card flex flex-col sm:overflow-hidden">
        <div className="lg:mx-auto flex w-full min-h-dvh">
          {/* Sidebar */}

          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="px-4 md:px-6 mt-4 h-10 flex justify-start">
              {/* Tlačítko pro zavření - animaci řeší shadcn interně */}
              <RxHamburgerMenu
                onClick={toggleSidebar}
                className="text-xl cursor-pointer hover:opacity-70 transition-opacity"
              />
            </SidebarHeader>

            <SidebarContent>

              <SidebarGroup>
                <SidebarGroupLabel className="uppercase tracking-wider">
                  Filtry
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filters.map((filter) => (
                      <SidebarMenuItem key={filter.id}>
                        <SidebarMenuButton
                          onClick={() => {
                            setSelectedFilter(filter.id);
                            setSelectedCollectionId(null);
                            setSelectedCollectionName(filter.name);
                            closeOnMobile();
                          }}
                          tooltip={filter.name}
                        >
                          <span>{filter.icon}</span>
                          <span>{filter.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Oddělovač (místo tvého divideru) */}
              <SidebarSeparator className="mx-0 my-2" />

              <SidebarGroup>
                {/* Používáme asChild, abychom mohli do Labelu vložit vlastní flexbox */}
                <SidebarGroupLabel asChild>
                  <div className="flex w-full items-center justify-between">
                    <span className="uppercase tracking-wider">Kolekce</span>
                    
                    {/* Kontejner pro tlačítka - stopPropagation zabrání bublání eventů, pokud by label byl klikací */}
                    <div 
                      className="flex items-center gap-1 shadow-none" 
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {/* Tlačítko PLUS */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowingAddInput(prev => !prev);
                          setEditMode(false);
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-all active:scale-95"
                        title="Přidat kolekci"
                      >
                        <FiPlus className="size-4" />
                      </button>

                      {/* Tlačítko EDITACE */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(prev => !prev);
                          setShowingAddInput(false);
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-sidebar-accent transition-all active:scale-95"
                        title={editMode ? "Dokončit úpravy" : "Upravit kolekce"}
                      >
                        {editMode ? (
                          <FiCheck className="text-green-600 size-4" />
                        ) : (
                          <FiEdit2 className="text-muted-foreground hover:text-foreground size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {showingAddInput && (
                      <SidebarMenuItem className="px-2 pb-1 pt-1">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (newCollectionName.trim()) {
                              handleAddCollection();
                              setShowingAddInput(false);
                            }
                          }}
                          className="flex w-full"
                        >
                          <input
                            autoFocus
                            placeholder="Název..."
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            onKeyDown={(e) => e.key === "Escape" && setShowingAddInput(false)}
                            className="h-8 w-full flex-1 bg-background border rounded-l-md px-2 text-sm outline-none focus:ring-1 focus:ring-ring focus:z-10"
                          />
                          <button
                            type="submit"
                            disabled={!newCollectionName.trim()}
                            className="flex h-8 w-8 shrink-0 items-center justify-center border border-l-0 rounded-r-md bg-sidebar-accent hover:bg-accent disabled:opacity-50 transition-colors"
                            title="Uložit"
                          >
                            <FiCheck className="text-green-600 size-4" />
                          </button>
                        </form>
                      </SidebarMenuItem>
                    )}
                    
                    {collections.map((col) => {
                      const isRenaming = editId === col.id;

                      return (
                        <SidebarMenuItem key={col.id}>
                          {isRenaming ? (
                            <div className="flex w-full items-center gap-2 px-2 py-1">
                              <input
                                type="text"
                                autoFocus
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                className="h-7 w-full flex-1 bg-background border rounded px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                              />
                              <div className="flex gap-1">
                                <FiCheck
                                  onClick={() => handleEditCollection(col.id)}
                                  className="cursor-pointer text-green-600 hover:scale-110"
                                />
                                <FiX
                                  onClick={() => setEditId(null)}
                                  className="cursor-pointer text-red-500 hover:scale-110"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <SidebarMenuButton
                                asChild
                                tooltip={col.name} // Zobrazí název v bublině, když je sidebar zavřený
                                onClick={() => {
                                  setSelectedCollectionId(col.id);
                                  setSelectedCollectionName(col.name);
                                  setSelectedFilter(null);
                                  closeOnMobile();
                                }}
                              >
                                <button className="flex items-center w-full">
                                  {/* Ikona složky - zobrazí se i v zavřeném stavu */}
                                  <FiFolder className="mr-2 size-4 shrink-0 text-muted-foreground" />
                                  
                                  <span className="truncate flex-1 text-left">{col.name}</span>
                                  
                                  {/* Počet úkolů - schová se automaticky v zavřeném stavu díky shadcn CSS */}
                                  {!editMode && (
                                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                                      {taskCounts[col.id] ?? 0}
                                    </span>
                                  )}
                                </button>
                              </SidebarMenuButton>

                              {/* Akce (Edit/Delete) vpravo - viditelné v editMode */}
                              {editMode && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-sidebar-accent shadow-sm rounded-sm px-1">
                                  <FiEdit2
                                    onClick={() => {
                                      setEditId(col.id);
                                      setEditName(col.name);
                                    }}
                                    className="cursor-pointer text-muted-foreground hover:text-foreground size-3.5"
                                  />

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button className="text-muted-foreground hover:text-destructive">
                                        <FiTrash2 className="size-3.5" />
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{`Smazat kolekci "${col.name}"?`}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tato akce je nevratná a odstraní všechny úkoly uvnitř.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteCollection(col.id)}
                                          className="bg-destructive hover:bg-destructive/90"
                                        >
                                          Smazat
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

            </SidebarContent>

            </Sidebar>

          <div className="relative z-[90] transition delay-150 duration-300 ease-in-out">
            <div
              {...handlers}
              tabIndex="0"
              className={`${
                openSide
                  ? "fixed w-full sm:relative sm:w-[200px] lg:w-[290px]"
                  : "hidden"
              } top-0 z-40 flex flex-col h-full overflow-y-auto bg-background text-foreground focus:outline-0 sm:max-w-[290px] transition delay-150 duration-300 ease-in-out`}
            >
              <div className="flex-1 px-4 md:px-6 pb-6 duration-300 ease-in-out">
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
                      closeOnMobile();
                    }}>
                      <span>{filter.icon}</span>
                      <span>{filter.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider mt-4" />
                
                {/* Přidání nové kolekce */}
                <div className="mt-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddCollection()
                    }}
                    className="flex w-full items-center"
                  >
                    <Input
                      type="text"
                      placeholder="Název kolekce"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      // pokud chceš nech klidně i svůj handleKeyDown
                      onKeyDown={handleKeyDown}
                      className="rounded-r-none text-muted-foreground text-sm"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      disabled={!newCollectionName.trim()}
                      title="Přidat kolekci"
                      aria-label="Přidat kolekci"
                    >
                      <FiPlus className="h-4 w-4" />
                    </Button>
                  </form>
                </div>


                {/* <div className="divider mt-4" /> */}
                
                <div className="grid grid-cols-[1fr,3ch] items-center mt-6 px-1">
                  <h3 className="text-sm text-foreground uppercase">Kolekce</h3>
                  <button
                    onClick={() => setEditMode(v => !v)}
                    className="h-6 justify-self-stretch flex items-center justify-center"  // ← vyplní 3ch a centrování
                    title={editMode ? "Dokončit úpravy" : "Upravit kolekce"}
                  >
                    {editMode ? <FiCheck className="text-green-600" /> : <FiEdit2 className="text-gray-500" />}
                  </button>
                </div>


                <ul className="mt-2 space-y-2">
                  {collections.map((col) => {
                    const isRenaming = editId === col.id;

                    return (
                      <li
                        key={col.id}
                        className={`${
                          (editMode || isRenaming)
                            ? "grid grid-cols-[1fr,auto]"
                            : "grid grid-cols-[1fr,3ch]"
                        } items-center ps-2 pe-1 py-3 md:py-1 shadow-md md:shadow-none`}
                      >
                        {isRenaming ? (
                          <>
                            {/* přejmenování kolekce */}
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              className="border p-1 text-sm"
                            />
                            <div className="justify-self-end flex gap-2">
                              <FiCheck
                                onClick={() => handleEditCollection(col.id)}
                                className="cursor-pointer text-green-600"
                                title="Uložit"
                              />
                              <FiX
                                onClick={() => setEditId(null)}
                                className="cursor-pointer text-red-500"
                                title="Zrušit"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* název kolekce */}
                            <span
                              onClick={() => {
                                setSelectedCollectionId(col.id);
                                setSelectedCollectionName(col.name);
                                setSelectedFilter(null);
                                closeOnMobile();
                              }}
                              className="cursor-pointer hover:underline"
                            >
                              {col.name}
                            </span>

                            {/* pravý sloupec: buď ikony (edit mode), nebo číslo */}
                            {editMode ? (
                              <div className="justify-self-end flex items-center gap-2">
                                <FiEdit2
                                  onClick={() => {
                                    setEditId(col.id);
                                    setEditName(col.name);
                                  }}
                                  className="cursor-pointer text-gray-500"
                                  title="Přejmenovat kolekci"
                                />

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <span
                                      className="cursor-pointer text-red-500"
                                      title="Smazat kolekci"
                                    >
                                      <FiTrash2 />
                                    </span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-foreground">
                                        {`Opravdu chceš smazat kolekci "${col.name}"?`}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-foreground">
                                        Tato akce je nevratná. Všechny úkoly v této kolekci budou nenávratně odstraněny.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="text-foreground">
                                        Zrušit
                                      </AlertDialogCancel>
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
                            ) : (
                              <span
                                className="justify-self-stretch text-center text-xs tabular-nums text-muted-foreground leading-none" // ← plná šířka buňky + center
                                title="Počet otevřených úkolů"
                              >
                                {taskCounts[col.id] ?? 0}
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
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
                  {/* <div className="hidden md:inline-flex "> */}
                  <div className="inline-flex ">
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
