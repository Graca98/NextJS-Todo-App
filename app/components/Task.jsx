"use client";

import { useState, useEffect } from "react";

export default function Task({
  taskText,
  change,
  status,
  deleteTask,
  modal,
  editTask,
}) {
  const editIcon = (
    <svg viewBox="0 0 24 24" fill="gray" height="1.5em" width="1.5em">
      <path d="M8.707 19.707L18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 00-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 000-2.828L19.414 3a2 2 0 00-2.828 0L15 4.586 19.414 9 21 7.414z" />
    </svg>
  );
  const deleteIcon = (
    <svg fill="gray" viewBox="0 0 16 16" height="1.5em" width="1.5em">
      <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
      <path
        fillRule="evenodd"
        d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
      />
    </svg>
  );
  const [dateNow, setDateNow] = useState("");

  useEffect(() => {
    let date = new Date();

    // Dnešní datum
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let czMonths = [
      "ledna",
      "února",
      "března",
      "dubna",
      "května",
      "června",
      "července",
      "srpna",
      "září",
      "října",
      "listopadu",
      "prosince",
    ];
    let year = date.getFullYear();

    let formattedDate = `${day}. ${czMonths[month]} ${year}`;

    // Aktuální čas
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Formátování hodin a minut s předponou 0, pokud je hodnota menší než 10
    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Formátování času
    let formattedTime = `${formattedHours}:${formattedMinutes}`;
    const currentTime = `${formattedDate} v ${formattedTime}`;
    setDateNow(currentTime);
  }, []);

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
          <span className="text-gray-400 text-xs lg:text-sm lg:basis-1/3">
            {dateNow}
          </span>
        </div>
        <div className="flex ml-auto gap-2">
          <label
            htmlFor={modal}
            onClick={editTask}
            className={`${!status ? "" : "invisible"} btn btn-circle bg-inherit hover:bg-gray-300 hover:rotate-12 active:bg-gray-400 p-1`}
          >
            {editIcon}
          </label>

          {/** 
          *{!status ? (
            <label
              htmlFor={modal}
              onClick={editTask}
              className="btn btn-outline-warning btn-xs"
            >
              Edit
            </label>
          ) : null}
          */}

          <button
            onClick={deleteTask}
            className="btn btn-circle bg-inherit hover:bg-gray-300 hover:rotate-12 active:bg-gray-400 p-1"
          >
            {deleteIcon}
          </button>
        </div>
      </label>
    </div>
  );
}
