"use client";

import { PiCalendarDots } from "react-icons/pi";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import useIsMobile from "../../lib/hooks/useIsMobile";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function TaskCard({
  title,
  status,
  timeToComplete,
  change,
  deleteTask,
  editTask,
  setOpenEditModal,
  isEditing,
  editValue,
  setEditValue,
  handleEditSave,
  handleEditCancel,
}) {
  const isMobile = useIsMobile();

  const formatCzechDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, "0")}. ${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}. ${date.getFullYear()}`;
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    editTask();
    if (isMobile) setOpenEditModal(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteTask();
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel()
    }
  };

  return (
    <div lang="cs" className={`flex items-center gap-2 shadow-md p-2 bg-background hover:bg-secondary text-foreground w-full ${status ? "opacity-50" : ""}`}>
      <input
        type="checkbox"
        className="checkbox checkbox-success checkbox-lg bg-background hover:bg-secondary w-6 flex-shrink-0"
        onChange={change}
        checked={status}
      />

      {/* Obsah */}
      <div className="flex flex-col lg:flex-row lg:items-center ml-1 flex-grow lg:gap-6 lg:justify-start">
        {isEditing && !isMobile ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className="border rounded-md p-1 md:px-2 text-sm w-full lg:basis-8/12"
          />
        ) : (
          <span className={`${status ? "line-through" : ""} lg:basis-8/12 break-all`}>
            {title}
          </span>
        )}

        <span className="flex items-center gap-x-3 text-gray-400 text-xs lg:text-sm lg:basis-3/12">
          <PiCalendarDots className={`${!timeToComplete && "hidden"}`} />
          {formatCzechDate(timeToComplete)}
        </span>
      </div>

      {/* Akce */}
      <div className="flex justify-end lg:basis-1/12">
        {isEditing && !isMobile ? (
          <>
            <button onClick={handleEditSave} className="btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:rotate-12 p-0">
              <FiCheck className="cursor-pointer text-green-600 text-lg" />
            </button>

            <button onClick={handleEditCancel} className="btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:rotate-12 p-0">
              <FiX className="cursor-pointer text-red-500 text-lg" />
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick} className={`${!status ? "" : "invisible"} btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:rotate-12 p-0`}>
              <FiEdit2 className="text-gray-500 text-lg" />
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:rotate-12 p-0" onClick={e => e.stopPropagation()} aria-label="Smazat úkol">
                  <FiTrash2 className="cursor-pointer text-red-500 text-lg" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">{`Opravdu chceš smazat úkol "${title}"?`}</AlertDialogTitle>
                  <AlertDialogDescription className="text-foreground">
                    Tato akce je nevratná. Úkol bude trvale odstraněn.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-foreground">Zrušit</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      deleteTask();
                    }}
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
  );
}
