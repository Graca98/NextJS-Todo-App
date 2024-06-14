"use client";

import { useState, useEffect } from "react";

export default function Task({
  taskText,
  change,
  status,
  deleteTask,
  modal,
  test,
}) {
  const [dateNow, setDateNow] = useState("");
  const [taskEdit, setTaskEdit] = useState(taskText);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    setDateNow(formattedDate);
  }, []);

  return (
    <div className="">
      <label className="flex justify-start cursor-pointer items-center gap-2 shadow-md p-2 hover:bg-gray-100 w-full ">
        <input
          type="checkbox"
          className="checkbox checkbox-success checkbox-lg bg-white hover:bg-white active:bg-white w-6 flex-shrink-0"
          onChange={change}
          checked={status}
        />
        <div className="flex flex-col ml-1 flex-grow">
          <span className={status ? "line-through" : ""}>{taskText}</span>
          <span className="text-gray-400 text-sm">{dateNow}</span>
        </div>
        <div className="flex ml-auto gap-2">
          {!status ? (
            <label
              htmlFor={modal}
              onClick={test}
              className="btn btn-outline-warning btn-xs"
            >
              Edit
            </label>
          ) : null}

          <button onClick={deleteTask} className="btn btn-outline-error btn-xs">
            Smazat
          </button>
        </div>
      </label>
    </div>
  );
}
