"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { cs } from "date-fns/locale";
import useIsMobile from "@/lib/hooks/useIsMobile";

const AddTaskFAB = ({ task, setTask, handleSubmit, taskDate, setTaskDate }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    taskDate ? new Date(taskDate) : undefined,
  );

  const inputRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 🔥 Autofocus fix (funguje i na mobilu)
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  const submitAndReset = async () => {
    await handleSubmit();

    setTask("");
    setTaskDate("");
    setSelectedDate(undefined);
    setShowCalendar(false);

    // znovu focus do inputu
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    if (date < today) return;

    setSelectedDate(date);
    setTaskDate(date.toISOString().split("T")[0]);
    setShowCalendar(false);
  };

  const setToday = () => handleDateSelect(today);
  const setTomorrow = () => handleDateSelect(addDays(today, 1));

  // Desktop zůstává původní
  // Desktop = klasický inline formulář
if (!isMobile) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-md">
        <Checkbox disabled />

        <Input
          placeholder="Přidat úkol"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1"
        />

        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className="justify-between min-w-[160px]"
            >
              {selectedDate
                ? format(selectedDate, "dd. MM. yyyy", { locale: cs })
                : "Datum"}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-72 p-3 space-y-3">
            {/* QUICK ACTIONS */}
            <div className="flex gap-2">
             <Button
  type="button"
  variant="outline"
  className="flex-1"
  onClick={() => {
    setToday()
    setDateOpen(false)
  }}
>
  Dnes
</Button>

              <Button
  type="button"
  variant="outline"
  className="flex-1"
  onClick={() => {
    setTomorrow()
    setDateOpen(false)
  }}
>
  Zítra
</Button>

            </div>

            {/* SECONDARY TOGGLE */}
            {!showCalendar && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowCalendar(true)}
              >
                Vybrat datum
              </Button>
            )}

            {/* CALENDAR */}
            {showCalendar && (
              <div className="flex justify-center">
                <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={(date) => {
    handleDateSelect(date)
    setShowCalendar(false)
    setDateOpen(false)
  }}
  disabled={(date) => date < today}
/>

              </div>
            )}
          </PopoverContent>
        </Popover>

        <Button
          variant="secondary"
          onClick={() => {
            handleSubmit()
            setSelectedDate(undefined)
            setTaskDate("")
          }}
        >
          Přidat
        </Button>
      </div>
    </div>
  )
}


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-2xl pb-10 px-4">
        <SheetHeader>
          <SheetTitle>Přidat úkol</SheetTitle>
          <SheetDescription>
            Tlačítko na přidání úkolu
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-5">
          {/* INPUT */}
          <div className="flex items-center gap-3">
            <Checkbox disabled />
            <Input
              ref={inputRef}
              placeholder="Přidat úkol"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitAndReset();
                }
              }}
              className="flex-1"
            />
          </div>

          {/* DATUM BUTTON */}
          <Button
            variant="secondary"
            className="justify-between"
            onClick={() => setShowCalendar((prev) => !prev)}
          >
            {selectedDate
              ? format(selectedDate, "dd. MM. yyyy", { locale: cs })
              : "Vybrat datum"}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>

          {/* QUICK SELECT + CALENDAR */}
          {showCalendar && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={setToday}
                >
                  Dnes
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={setTomorrow}
                >
                  Zítra
                </Button>
              </div>

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < today}
                />
              </div>
            </div>
          )}

          <Button
            onClick={submitAndReset}
            variant="secondary"
            className="w-full"
          >
            Přidat
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddTaskFAB;
