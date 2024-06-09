"use client";

import { useState, useEffect } from "react";

export default function Task({ taskText, change, status, deleteTask }) {
  const [dateNow, setDateNow] = useState("");

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
          <button className="btn btn-outline-warning btn-xs">Edit</button>
          <button onClick={deleteTask} className="btn btn-outline-error btn-xs">
            Smazat
          </button>

          <label className="btn btn-primary" htmlFor="modal-1">
            Open Modal
          </label>
          <input className="modal-state" id="modal-1" type="checkbox" />
          <div className="modal">
            <label className="modal-overlay" htmlFor="modal-1"></label>
            <div className="modal-content flex flex-col gap-5">
              <label
                htmlFor="modal-1"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </label>
              <h2 className="text-xl">Modal title 1</h2>
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                dolorum voluptate ratione dicta. Maxime cupiditate, est commodi
                consectetur earum iure, optio, obcaecati in nulla saepe maiores
                nobis iste quasi alias!
              </span>
              <div className="flex gap-3">
                <button className="btn btn-error btn-block">Delete</button>

                <button className="btn btn-block">Cancel</button>
              </div>
            </div>
          </div>
          
        </div>
      </label>
    </div>
  );
}
