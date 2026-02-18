"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { PiCalendarDots } from "react-icons/pi"
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { cs } from "date-fns/locale"

export default function TaskCard({
  title,
  status,
  timeToComplete,
  change,
  deleteTask,
  editTask,
  isEditing,
  editValue,
  setEditValue,
  handleEditSave,
  handleEditCancel,
  editDate,
  setEditDate,
}) {
  const [showCalendar, setShowCalendar] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("cs-CZ")
  }

  const handleSelectDate = (date) => {
    if (!date) return
    if (date < today) return

    setEditDate(date.toISOString().split("T")[0])
    setShowCalendar(false)
  }

  return (
    <Card
      className={`px-3 md:px-4 py-2 border border-border rounded-none md:rounded-md bg-card hover:bg-muted/40 transition-colors text-sm ${
        status ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <Checkbox checked={status} onCheckedChange={change} />

        <div className="flex flex-col md:flex-row md:items-center flex-1 gap-2">

          {/* TITLE */}
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave()
                if (e.key === "Escape") handleEditCancel()
              }}
              className="bg-card outline-none px-0 py-2 rounded-md text-sm w-full "
            />
          ) : (
            <span className={`flex-1 ${status ? "line-through" : ""}`}>
              {title}
            </span>
          )}

          {/* DATE */}
          {isEditing ? (
            <div className="relative">

              <Button
                type="button"
                variant="secondary"
                className="justify-between min-w-[160px]"
                onClick={() => setShowCalendar(prev => !prev)}
              >
                {editDate
                  ? format(new Date(editDate), "dd. MM. yyyy", { locale: cs })
                  : "Datum"}

                {editDate ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditDate(null)
                      setShowCalendar(false)
                    }}
                    className="ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    ✕
                  </span>
                ) : (
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>

              {showCalendar && (
                <div className="absolute left-0 mt-3 w-72 bg-popover border border-border rounded-md shadow-lg p-3 space-y-3 z-50">

                  {/* QUICK SELECT */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleSelectDate(today)}
                    >
                      Dnes
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        handleSelectDate(addDays(today, 1))
                      }
                    >
                      Zítra
                    </Button>
                  </div>

                  {/* CALENDAR */}
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={editDate ? new Date(editDate) : undefined}
                      onSelect={handleSelectDate}
                      disabled={(date) => date < today}
                    />
                  </div>

                </div>
              )}

            </div>
          ) : (
            timeToComplete && (
              <span className="flex items-center gap-2 text-muted-foreground text-sm">
                <PiCalendarDots />
                {formatDate(timeToComplete)}
              </span>
            )
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="icon" variant="ghost" onClick={handleEditSave}>
                <FiCheck className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleEditCancel}>
                <FiX className="w-4 h-4 text-destructive" />
              </Button>
            </>
          ) : (
            <>
              <Button
  size="icon"
  variant="ghost"
  onClick={() => {
    if (isMobile) {
      editTask()
    } else {
      editTask()
    }
  }}
>
  <FiEdit2 className="w-4 h-4" />
</Button>
              <Button size="icon" variant="ghost" onClick={deleteTask}>
                <FiTrash2 className="w-4 h-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
