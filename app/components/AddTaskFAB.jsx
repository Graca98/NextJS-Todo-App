"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import useIsMobile from "@/lib/hooks/useIsMobile"
import AddTask from "./AddTask.jsx";

const AddTaskFAB = ({
  task,
  setTask,
  handleSubmit,
  taskDate,
  setTaskDate,
}) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  // Desktop → klasický AddTask
  if (!isMobile) {
    return (
      <AddTask
        task={task}
        setTask={setTask}
        handleSubmit={handleSubmit}
        taskDate={taskDate}
        setTaskDate={setTaskDate}
      />
    )
  }

  // Mobile → FAB + Sheet
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="
              fixed bottom-6 right-6
              h-14 w-14
              rounded-full
              shadow-xl
              z-50
            "
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="rounded-t-2xl pb-10"
        >
          {/* handle bar */}
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />

          <AddTask
            task={task}
            setTask={setTask}
            taskDate={taskDate}
            setTaskDate={setTaskDate}
            handleSubmit={() => {
              handleSubmit()
              setOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AddTaskFAB
