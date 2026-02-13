"use client";

import { useCallback, useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiFolder } from "react-icons/fi";
import { FiPlus } from "react-icons/fi"
import { FaStar, FaClock, FaCalendarDay, FaListAlt, FaCheckCircle } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import { useSidebar, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupAction, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
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

interface SidebarProps {
    selectedFilter: any
    setSelectedFilter: React.Dispatch<any>
    selectedCollectionId: any
    setSelectedCollectionId: React.Dispatch<any>
    // selectedCollectionName: any
    // setSelectedCollectionName: React.Dispatch<any>
    collections: any[]
    isLoadingCollections: boolean
    setIsLoadingCollections: any
    onCollectionsChanged: () => Promise<void>
    taskCounts: Record<string, number>
  }


export default function SidebarComponent({
  selectedFilter,
  setSelectedFilter,
  selectedCollectionId,
  setSelectedCollectionId,
  // selectedCollectionName,
  // setSelectedCollectionName,
  collections,
  isLoadingCollections,
  setIsLoadingCollections,
  onCollectionsChanged,
  taskCounts
}: SidebarProps) {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  // const [selectedFilter, setSelectedFilter] = useState(null);
  const [editMode, setEditMode] = useState(false);      // globální „režim úprav“
  const [showingAddInput, setShowingAddInput] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false)


  const { toast } = useToast()


  useEffect(() => {
    if (
      !hasInitialized &&
      !selectedCollectionId &&
      !selectedFilter &&
      collections.length > 0
    ) {
      setSelectedCollectionId(collections[0].id)
      setHasInitialized(true)
    }
  }, [collections, selectedCollectionId, selectedFilter, hasInitialized])



  // useEffect(() => {
  //   if (!openSide) setEditMode(false);
  // }, [openSide]);


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
    await onCollectionsChanged();

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
    await onCollectionsChanged();

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
    await onCollectionsChanged();

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
  // const handlers = useSwipeable({
  //   onSwipedRight: () => setOpenSide(true),
  //   onSwipedLeft: () => setOpenSide(false),
  //   delta: 50,
  // });

  // const closeOnMobile = () => {
  //   if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
  //     setOpenSide(false);
  //   }
  // };
  
  
  return (
    <>
      {/* <div {...handlers} className="bg-card flex flex-col sm:overflow-hidden"> */}
      <div className="bg-sidebar flex flex-col h-full">
        <div className="flex h-full">
          {/* Sidebar */}

          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="mt-4 h-10 flex flex-row items-center !p-0"> 
              <div 
                className={`flex items-center justify-center shrink-0 
                  ${isMobile ? "w-12" : "w-[--sidebar-width-icon]"}
                `}
              >
                <RxHamburgerMenu 
                  onClick={toggleSidebar} 
                  className="text-xl cursor-pointer hover:opacity-70 transition-opacity" 
                /> 
              </div>
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
                            // setSelectedCollectionName(filter.name);
                            // closeOnMobile();
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
                            e.preventDefault()
                            if (newCollectionName.trim()) {
                              handleAddCollection()
                              setShowingAddInput(false)
                            }
                          }}
                          className="flex w-full items-center"
                        >
                          <Input
                            autoFocus
                            placeholder="Název..."
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            onKeyDown={(e) => e.key === "Escape" && setShowingAddInput(false)}
                            className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />

                          <Button
                            type="submit"
                            size="icon"
                            variant="secondary"
                            disabled={!newCollectionName.trim()}
                            className="rounded-l-none border border-input border-l-0"
                          >
                            <FiCheck className="size-4" />
                          </Button>
                        </form>
                      </SidebarMenuItem>
                    )}
                    

                    {isLoadingCollections ? (
                      <div className="px-2 py-2 space-y-2">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="flex items-center gap-2 px-2 py-1">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-6" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      collections.map((col) => {
                      const isRenaming = editId === col.id;

                      return (
                        <SidebarMenuItem key={col.id}>
  <div className="flex items-center justify-between w-full px-2 py-2">

    {/* LEVÁ ČÁST */}
    <div
      onClick={() => {
        setSelectedCollectionId(col.id)
        setSelectedFilter(null)
      }}
      className="flex items-center gap-2 flex-1 cursor-pointer"
    >
      <FiFolder className="size-4 shrink-0 text-muted-foreground" />

      {isRenaming ? (
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleEditKeyDown}
          className="bg-transparent outline-none text-sm w-full"
        />
      ) : (
        <span className="truncate text-sm">
          {col.name}
        </span>
      )}
    </div>

    {/* PRAVÁ ČÁST — VŽDY STEJNÁ ŠÍŘKA */}
    <div className="flex items-center gap-2 shrink-0 min-w-[48px] justify-end">

      {isRenaming ? (
        <>
          <FiCheck
            onClick={() => handleEditCollection(col.id)}
            className="cursor-pointer text-green-500 hover:opacity-70"
          />
          <FiX
            onClick={() => setEditId(null)}
            className="cursor-pointer text-red-500 hover:opacity-70"
          />
        </>
      ) : !editMode ? (
        <span className="text-xs text-muted-foreground tabular-nums">
          {taskCounts[col.id] ?? 0}
        </span>
      ) : (
        <>
          <FiEdit2
            onClick={() => {
              setEditId(col.id)
              setEditName(col.name)
            }}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-muted-foreground hover:text-destructive">
                <FiTrash2 />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Smazat kolekci "{col.name}"?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tato akce je nevratná.
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
        </>
      )}

    </div>
  </div>
</SidebarMenuItem>



                        )}
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

            </SidebarContent>

            </Sidebar>
          
          {/* Tady se zobrazuje TaskPage */}
            {/* <div className="flex-1">
              {selectedFilter ? (
                <TaskPage filter={selectedFilter} />
              ) : selectedCollectionId ? (
                <TaskPage taskID={selectedCollectionId} />
              ) : (
                <p>Vyber kolekci nebo filtr...</p>
              )}
            </div> */}
            
            {/* Footer */}
            {/* <div className="mx-auto w-full max-w-screen-xl gap-6 pt-4 pb-2 md:pt-16 md:pb-4 px-1">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400">Aplikaci vytvořil Denis G.</p>
              </div>
            </div> */}
          
        </div>

      </div>
    </>
  );
}
