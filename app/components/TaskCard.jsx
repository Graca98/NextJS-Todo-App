"use client";

//todo Změnit ikonu hodinek na ikonu datumu

import { PiCalendarDots } from "react-icons/pi";
import { HiPencil } from "react-icons/hi2";
import { BsTrash } from "react-icons/bs";

export default function TaskCard({
  title,
  status,
  timeToComplete,
  change,
  deleteTask,
  editTask,
  setOpenEditModal,
}) {
  const handleEdit = () => {
    setOpenEditModal(true);
    editTask();
  };

  const formatCzechDate = (dateStr) => {
    if (!dateStr) return ""
  
    const date = new Date(dateStr)
  
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
  
    return `${day}. ${month}. ${year}`
  }

  return (
    <div className="">
      <label
        className={`flex justify-start cursor-pointer items-center gap-2 shadow-md p-2 bg-white hover:bg-gray-200 w-full ${
          status ? "opacity-50" : ""
        }`}
      >
        <input
          type="checkbox"
          className="checkbox checkbox-success checkbox-lg bg-white hover:bg-white active:bg-white w-6 flex-shrink-0"
          onChange={change}
          checked={status}
        />
        <div className="flex flex-col lg:flex-row lg:items-center ml-1 flex-grow lg:gap-6 lg:justify-start">
          <span
            className={`${
              status ? "line-through" : ""
            } lg:basis-8/12 break-all`}
          >
            {title}
          </span>
          <span className="flex items-center gap-x-3 text-gray-500 text-xs lg:text-sm lg:basis-3/12">
            <PiCalendarDots className={`${!timeToComplete && "hidden"}`} />
            {formatCzechDate(timeToComplete)}
          </span>
        </div>
        <div className="flex justify-end lg:basis-1/12">
          <label
            onClick={handleEdit}
            className={`${
              !status ? "" : "invisible"
            } btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:bg-gray-300 hover:rotate-12 active:bg-gray-400 p-0`}
          >
            <HiPencil className="text-gray-500 text-lg" />
          </label>

          <button
            onClick={deleteTask}
            className="btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:bg-gray-300 hover:rotate-12 active:bg-gray-400 p-0"
          >
            <BsTrash className="text-gray-500 text-lg" />
          </button>
        </div>
      </label>
    </div>
  );
}
