"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoFilterSharp } from "react-icons/io5";
import TaskPage from "./TaskPage";

export default function Sidebar() {
  const [openSide, setOpenSide] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();
        setCollections(data);
        if (data.length > 0) {
          setSelectedCollectionId(data[0].id);
        }
      } catch (error) {
        console.error("Chyba při načítání kolekcí:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <>
      <div className="background flex flex-col">
        <div className="lg:mx-auto flex w-full min-h-dvh">
          {/* Sidebar */}
          <div className="relative z-[90]">
            <div
              tabIndex="0"
              className={`${
                openSide
                  ? "fixed w-full sm:relative sm:w-[200px] lg:w-[290px]"
                  : "hidden"
              } top-0 z-40 flex flex-col h-full overflow-y-auto bg-white focus:outline-0 sm:max-w-[290px] duration-500`}
            >
              <div className="flex-1 px-4 md:px-6">
                <div className="flex items-center mb-2 mt-4 h-10">
                  <RxHamburgerMenu
                    onClick={() => setOpenSide(false)}
                    className={`${!openSide && "hidden"} text-xl`}
                  />
                </div>
                <div className="flex">
                  <div className="border rounded-full p-2 mr-2">
                    <Image
                      src="/next.svg"
                      width={32}
                      height={32}
                      alt="user image"
                    />
                  </div>
                  <h2>User 1</h2>
                </div>

                <ul className="mt-4 space-y-1">
                  {collections.map((col) => (
                    <li
                      key={col.id}
                      className="cursor-pointer hover:underline"
                      onClick={() => setSelectedCollectionId(col.id)}
                    >
                      {col.name}
                    </li>
                  ))}
                </ul>

                <div className="divider"></div>
              </div>
            </div>
          </div>

          {/* Vlastní obsah vpravo */}
          <div className="flex flex-col w-full mx-4 md:mx-6">
            {/* Titulek */}
            <div className="flex flex-col mb-8 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RxHamburgerMenu
                    onClick={() => setOpenSide(true)}
                    className={`${openSide && "hidden"} text-xl`}
                  />
                  <h1 className="text-xl font-semibold px-2 py-1.5">
                    Todo App
                  </h1>
                </div>
                <div>
                  <div className="dropdown">
                    <label
                      className="inline-flex items-center w-fit px-4"
                      tabIndex={0}
                    >
                      <IoFilterSharp className="mr-1 text-lg" />
                      Filtr
                    </label>
                    <div className="dropdown-menu dropdown-menu-bottom-left">
                      {/* Zde by byly filtry */}
                    </div>
                  </div>
                </div>
              </div>
              <span className={`hidden ${openSide ? "pl-2" : "pl-7"} text-xs`}>
                Zde bude dnešní den, datum
              </span>
            </div>

            {/* Tady se zobrazuje TaskPage */}
            {selectedCollectionId ? (
              <TaskPage taskID={selectedCollectionId} />
            ) : (
              <p>Vyber kolekci...</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto w-full max-w-screen-xl gap-6 pt-3 pb-2 md:pt-6 md:pb-4 px-1">
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-600">Aplikaci vytvořil Denis G.</p>
          </div>
        </div>
      </div>
    </>
  );
}
