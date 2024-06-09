"use client";

import { useState, useEffect } from "react";

export default function Task({ taskText, change, status, deleteTask, modal }) {
  const [dateNow, setDateNow] = useState("");
  const [taskEdit, setTaskEdit] = useState(taskText);


  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    setDateNow(formattedDate);
  }, []);

  return (
    <div>
      <label className="flex justify-start cursor-pointer items-center gap-2 shadow-md p-2 hover:bg-gray-200 w-full ">
        <input
          type="checkbox"
          className="checkbox checkbox-success checkbox-lg bg-inherit hover:bg-inherit w-6 flex-shrink-0"
          onChange={change}
          checked={status}
        />
        <div className="flex flex-col ml-1 flex-grow">
          <span className={status ? "line-through" : ""}>{taskText}</span>
          <span className="text-gray-400 text-sm">{dateNow}</span>
        </div>
        <div className="flex ml-auto gap-2">
          <label htmlFor={modal} className="btn btn-outline-warning btn-xs">Edit</label>
          <button onClick={deleteTask} className="btn btn-outline-error btn-xs">
            Smazat
          </button>



        </div>
      </label>
    </div>
  );
}
