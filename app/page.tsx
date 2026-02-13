"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "@/app/components/Sidebar"
import TaskPage from "@/app/components/TaskPage"
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import { useSidebar } from "@/components/ui/sidebar"
import { RxHamburgerMenu } from "react-icons/rx";
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic";

export default function Home() {
  const [collections, setCollections] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState(null)
  // const [selectedCollectionName, setSelectedCollectionName] = useState("")
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [taskCounts, setTaskCounts] = useState({});     // { [collectionId]: number }
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const collectionFromUrl = searchParams.get("collection")
    const filterFromUrl = searchParams.get("filter")

    if (collectionFromUrl) {
      setSelectedCollectionId(Number(collectionFromUrl))
      setSelectedFilter(null)
    }

    if (filterFromUrl) {
      setSelectedFilter(filterFromUrl)
      setSelectedCollectionId(null)
    }
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedCollectionId) {
      params.set("collection", selectedCollectionId)
    }

    if (selectedFilter) {
      params.set("filter", selectedFilter)
    }

    router.replace(`?${params.toString()}`)
  }, [selectedCollectionId, selectedFilter])


  // useEffect(() => {
  //   if (selectedCollectionId) {
  //     router.replace(`?collection=${selectedCollectionId}`)
  //   }
  // }, [selectedCollectionId])

  // useEffect(() => {
  //   if (selectedFilter) {
  //     router.replace(`?filter=${selectedFilter}`)
  //   }
  // }, [selectedFilter])

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
  
  const refreshTaskCounts = async () => {
  await fetchTaskCounts()
}

  const fetchCollections = useCallback(async () => {
      try {
        setIsLoadingCollections(true);
  
        const res = await fetch("/api/collections");
        if (!res.ok) throw new Error('Chyba při načítání kolekcí');
        const data = await res.json();
        setCollections(data);
        
    
        await fetchTaskCounts(); 
  
      } catch (error) {
          console.error(error);
          alert(error.message);
      } finally {
          setIsLoadingCollections(false);
    }
    }, [fetchTaskCounts]);


  const refreshCollections = async () => {
  await fetchCollections()
  await fetchTaskCounts()
}

  
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const currentCollection = collections.find(
  (c) => c.id === selectedCollectionId
)

  const filterLabels = {
    important: "Důležité",
    overdue: "Po splatnosti",
    today: "Dnes",
    all: "Všechny úkoly",
    completed: "Dokončené",
  }





  const isReady = !isLoadingCollections && selectedCollectionId;
  

  const { toggleSidebar, state } = useSidebar()

  return (
    <>
      <Sidebar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
        // selectedCollectionName={selectedCollectionName}
        // setSelectedCollectionName={setSelectedCollectionName}
        collections={collections}
        isLoadingCollections={isLoadingCollections}
        setIsLoadingCollections={setIsLoadingCollections}
        onCollectionsChanged={refreshCollections}
        taskCounts={taskCounts}
      />

      <main className="flex-1 p-6">

        {/* Vlastní obsah vpravo */}
          {/* Vlastní obsah vpravo */}
      <div className="flex flex-col w-full text-foreground">

        {/* Titulek */}
        <div className="flex flex-col mb-8 mt-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center">

              {/* Hamburger */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-xl mr-3"
              >
                <RxHamburgerMenu />
              </button>

              {isLoadingCollections ? (
                <Skeleton className="h-8 w-40" />
              ) : selectedFilter ? (
                <h1 className="text-2xl font-semibold">
                  {filterLabels[selectedFilter]}
                </h1>
              ) : currentCollection ? (
                <h1 className="text-2xl font-semibold">
                  {currentCollection.name}
                </h1>
              ) : (
                <Skeleton className="h-8 w-40" />
              )}

            </div>

            <div className="inline-flex">
              <ThemeSwitcher />
            </div>

          </div>

          <span className="text-xs hidden md:block">
            {isLoadingCollections ? (
              <Skeleton className="h-4 w-24 mt-2" />
            ) : (
              <span className="text-xs text-muted-foreground mt-2">
                {new Date().toLocaleDateString("cs-CZ", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            )}
          </span>

        </div>
        </div>



        <TaskPage
          filter={selectedFilter}
          taskID={selectedCollectionId}
          isLoadingCollections={isLoadingCollections}
        />
      </main>
    </>
  )
}
