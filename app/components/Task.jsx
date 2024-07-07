"use client";

import { FaClock } from "react-icons/fa6";
import { HiPencil } from "react-icons/hi2";
import { BsTrash } from "react-icons/bs";

export default function Task({
  taskText,
  status,
  taskTime,
  change,
  deleteTask,
  editTask,
  setOpenEditModal
}) {

  const handleEdit = () => {
    setOpenEditModal(true)
    editTask()
  }

  return (
    <div className="">
      <label className={`flex justify-start cursor-pointer items-center gap-2 shadow-md p-2 bg-white hover:bg-gray-200 w-full ${status ? 'opacity-50' : ""}`}>
        <input
          type="checkbox"
          className="checkbox checkbox-success checkbox-lg bg-white hover:bg-white active:bg-white w-6 flex-shrink-0"
          onChange={change}
          checked={status}
        />
        <div className="flex flex-col lg:flex-row lg:items-center ml-1 flex-grow lg:gap-6 lg:justify-start">
          <span className={`${status ? "line-through" : ""} lg:basis-2/3`}>
            {taskText}
          </span>
          <span className="flex items-center gap-x-1.5 text-gray-400 text-xs lg:text-sm lg:basis-1/3">
            <FaClock />
            {taskTime}
          </span>
        </div>
        <div className="flex ml-auto">
          <label
            onClick={handleEdit}
            className={`${!status ? "" : "invisible"} btn btn-circle md:w-[2rem] md:h-[2rem] bg-inherit hover:bg-gray-300 hover:rotate-12 active:bg-gray-400 p-0`}
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
