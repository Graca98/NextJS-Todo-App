"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import TaskPage from "./TaskPage"

export default function AppShell() {
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState(null)

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
      />

      <main className="flex-1 p-6">
        <TaskPage
          filterId={selectedFilter?.id}
          collectionId={selectedCollectionId}
        />
      </main>
    </div>
  )
}
