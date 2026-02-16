"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { cs } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

const AddTask = ({ task, setTask, handleSubmit, taskDate, setTaskDate }) => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    taskDate ? new Date(taskDate) : undefined
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleDateSelect = (date) => {
    if (!date) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today) return

    setSelectedDate(date)
    setTaskDate(date.toISOString().split("T")[0])

    setShowCalendar(false)
    setOpen(false)
  }



  const setToday = () => handleDateSelect(today)
  const setTomorrow = () => handleDateSelect(addDays(today, 1))

  return (
    <Card className="px-3 md:px-4 py-2 md:py-4 mb-6 bg-card border border-border rounded-none md:rounded-md">
      <div className="flex items-center gap-3">

        <Checkbox disabled />

        <div className="flex flex-col md:flex-row gap-3 flex-1">

          <Input
            placeholder="Přidat úkol"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1"
          />

          {/* DATE PICKER */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="w-full md:w-40 justify-between text-left font-normal"
              >
                {selectedDate
                  ? format(selectedDate, "dd. MM. yyyy", { locale: cs })
                  : "Datum"}
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-72 p-3 space-y-3 animate-in fade-in-0 zoom-in-95 duration-200"
            >
              {/* QUICK SELECT */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const today = new Date()
                    handleDateSelect(today)
                  }}
                >
                  Dnes
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    handleDateSelect(tomorrow)
                  }}
                >
                  Zítra
                </Button>
              </div>

              {/* TOGGLE CALENDAR */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                Vybrat datum
              </Button>

              {/* CALENDAR */}
              {showCalendar && (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    handleDateSelect(date)
                    setShowCalendar(false)
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  autoFocus
                />
              )}
            </PopoverContent>

          </Popover>

        </div>

        <Button onClick={handleSubmit} variant="secondary">
          Přidat
        </Button>

      </div>
    </Card>
  )
}

export default AddTask
