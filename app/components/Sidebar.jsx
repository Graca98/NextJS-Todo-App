"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoFilterSharp } from "react-icons/io5";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import TaskPage from "./TaskPage";

export default function Sidebar() {
  const [openSide, setOpenSide] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

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
  

  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) return;
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCollectionName.trim() }),
    });
    setNewCollectionName("");
    await fetchCollections();
  };

  const handleDeleteCollection = async (id) => {
    if (!confirm("Opravdu chceš smazat kolekci?")) return;
    await fetch(`/api/collections?id=${id}`, {
      method: "DELETE",
    });
    await fetchCollections();
  };

  const handleEditCollection = async (id) => {
    if (!editName.trim()) return;
    await fetch("/api/collections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName.trim() }),
    });
    setEditId(null);
    setEditName("");
    await fetchCollections();
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections(data);
    } catch (error) {
      console.error("Chyba při načítání kolekcí:", error);
    }
  };

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
                <div className="flex items-center">
                  <h2>User 1</h2>
                  <div className="border rounded-full p-2 ml-2">
                    <Image
                      src="/next.svg"
                      width={32}
                      height={32}
                      alt="user image"
                    />
                  </div>
                </div>

                {/* Přidání nové kolekce */}
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Nová kolekce..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="border p-2 w-full text-sm"
                  />
                  <button
                    onClick={handleAddCollection}
                    className="bg-blue-500 text-white mt-2 py-2 px-4 rounded text-sm w-full"
                  >
                    Přidat kolekci
                  </button>
                </div>

                <div className="divider mt-4" />

                <ul className="mt-4 space-y-2">
                  {collections.map((col) => (
                    <li
                      key={col.id}
                      className="flex items-center justify-between"
                    >
                      {editId === col.id ? (
                        <>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border p-1 text-sm w-2/3"
                          />
                          <div className="flex gap-1">
                            <FiCheck
                              onClick={() => handleEditCollection(col.id)}
                              className="cursor-pointer text-green-600"
                            />
                            <FiX
                              onClick={() => setEditId(null)}
                              className="cursor-pointer text-red-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <span
                            onClick={() => setSelectedCollectionId(col.id)}
                            className="cursor-pointer hover:underline w-2/3"
                          >
                            {col.name}
                          </span>
                          <div className="flex gap-1">
                            <FiEdit2
                              onClick={() => {
                                setEditId(col.id);
                                setEditName(col.name);
                              }}
                              className="cursor-pointer"
                            />
                            <FiTrash2
                              onClick={() => handleDeleteCollection(col.id)}
                              className="cursor-pointer text-red-500"
                            />
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

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
                  <h1 className={`text-xl font-semibold px-2 py-1.5 ${openSide ? "pl-0" : "ml-4"}`}>
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
                      {/* Filtry */}
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`hidden ${openSide ? "pl-2" : "pl-7"} text-xs`}
              >
                Zde bude dnešní den, datum
              </span>
            </div>

            {/* Tady se zobrazuje TaskPage */}
            {selectedCollectionId ? (
              <TaskPage taskID={selectedCollectionId} />
            ) : (
              <p>Načítám úkoly...</p>
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
