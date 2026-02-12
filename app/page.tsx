"use client"

import { useState } from "react"
import Sidebar from "@/app/components/Sidebar"
import TaskPage from "@/app/components/TaskPage"
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import { useSidebar } from "@/components/ui/sidebar"
import { RxHamburgerMenu } from "react-icons/rx";


export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState(null)
  const [selectedCollectionName, setSelectedCollectionName] = useState("")

  const { toggleSidebar, state } = useSidebar()

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
        selectedCollectionName={selectedCollectionName}
        setSelectedCollectionName={setSelectedCollectionName}
      />

      <main className="flex-1 p-6">

        {/* Vlastní obsah vpravo */}
          {/* Vlastní obsah vpravo */}
      <div className="flex flex-col w-full mx-4 md:mx-6 text-foreground">

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

              <h1 className="text-2xl font-semibold">
                {selectedCollectionName || "Todo App"}
              </h1>

            </div>

            <div className="inline-flex">
              <ThemeSwitcher />
            </div>

          </div>

          <span className="text-xs pl-2 hidden md:block">
            Zde bude dnešní den, datum
          </span>

        </div>
        </div>



        <TaskPage
          filter={selectedFilter}
          taskID={selectedCollectionId}
        />
      </main>
    </div>
  )
}
