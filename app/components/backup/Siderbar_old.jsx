<div className="relative z-[90] transition delay-150 duration-300 ease-in-out">
            <div
              {...handlers}
              tabIndex="0"
              className={`${
                openSide
                  ? "fixed w-full sm:relative sm:w-[200px] lg:w-[290px]"
                  : "hidden"
              } top-0 z-40 flex flex-col h-full overflow-y-auto bg-background text-foreground focus:outline-0 sm:max-w-[290px] transition delay-150 duration-300 ease-in-out`}
            >
              <div className="flex-1 px-4 md:px-6 pb-6 duration-300 ease-in-out">
                <div className="flex items-center mb-2 mt-4 h-10">
                  <RxHamburgerMenu
                    onClick={() => setOpenSide(false)}
                    className={`${!openSide && "hidden"} text-xl`}
                  />
                </div>

                {/*todo User - do budoucna */}
                {/* <div className="flex items-center">
                  <h2>User 1</h2>
                  <div className="border rounded-full p-2 ml-2">
                    <Image
                      src="/next.svg"
                      width={32}
                      height={32}
                      alt="user image"
                    />
                  </div>
                </div> */}

                {/* Filtry */}
                <h3 className="mt-6 mb-2 text-sm text-foreground uppercase">Filtry</h3>
                <ul className="space-y-2">
                  {filters.map((filter) => (
                    <li key={filter.id} className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => {
                      setSelectedFilter(filter.id);
                      setSelectedCollectionId(null);
                      setSelectedCollectionName(filter.name);
                      closeOnMobile();
                    }}>
                      <span>{filter.icon}</span>
                      <span>{filter.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider mt-4" />
                
                {/* Přidání nové kolekce */}
                <div className="mt-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddCollection()
                    }}
                    className="flex w-full items-center"
                  >
                    <Input
                      type="text"
                      placeholder="Název kolekce"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      // pokud chceš nech klidně i svůj handleKeyDown
                      onKeyDown={handleKeyDown}
                      className="rounded-r-none text-muted-foreground text-sm"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      disabled={!newCollectionName.trim()}
                      title="Přidat kolekci"
                      aria-label="Přidat kolekci"
                    >
                      <FiPlus className="h-4 w-4" />
                    </Button>
                  </form>
                </div>


                {/* <div className="divider mt-4" /> */}
                
                <div className="grid grid-cols-[1fr,3ch] items-center mt-6 px-1">
                  <h3 className="text-sm text-foreground uppercase">Kolekce</h3>
                  <button
                    onClick={() => setEditMode(v => !v)}
                    className="h-6 justify-self-stretch flex items-center justify-center"  // ← vyplní 3ch a centrování
                    title={editMode ? "Dokončit úpravy" : "Upravit kolekce"}
                  >
                    {editMode ? <FiCheck className="text-green-600" /> : <FiEdit2 className="text-gray-500" />}
                  </button>
                </div>


                <ul className="mt-2 space-y-2">
                  {collections.map((col) => {
                    const isRenaming = editId === col.id;

                    return (
                      <li
                        key={col.id}
                        className={`${
                          (editMode || isRenaming)
                            ? "grid grid-cols-[1fr,auto]"
                            : "grid grid-cols-[1fr,3ch]"
                        } items-center ps-2 pe-1 py-3 md:py-1 shadow-md md:shadow-none`}
                      >
                        {isRenaming ? (
                          <>
                            {/* přejmenování kolekce */}
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              className="border p-1 text-sm"
                            />
                            <div className="justify-self-end flex gap-2">
                              <FiCheck
                                onClick={() => handleEditCollection(col.id)}
                                className="cursor-pointer text-green-600"
                                title="Uložit"
                              />
                              <FiX
                                onClick={() => setEditId(null)}
                                className="cursor-pointer text-red-500"
                                title="Zrušit"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* název kolekce */}
                            <span
                              onClick={() => {
                                setSelectedCollectionId(col.id);
                                setSelectedCollectionName(col.name);
                                setSelectedFilter(null);
                                closeOnMobile();
                              }}
                              className="cursor-pointer hover:underline"
                            >
                              {col.name}
                            </span>

                            {/* pravý sloupec: buď ikony (edit mode), nebo číslo */}
                            {editMode ? (
                              <div className="justify-self-end flex items-center gap-2">
                                <FiEdit2
                                  onClick={() => {
                                    setEditId(col.id);
                                    setEditName(col.name);
                                  }}
                                  className="cursor-pointer text-gray-500"
                                  title="Přejmenovat kolekci"
                                />

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <span
                                      className="cursor-pointer text-red-500"
                                      title="Smazat kolekci"
                                    >
                                      <FiTrash2 />
                                    </span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-foreground">
                                        {`Opravdu chceš smazat kolekci "${col.name}"?`}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-foreground">
                                        Tato akce je nevratná. Všechny úkoly v této kolekci budou nenávratně odstraněny.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="text-foreground">
                                        Zrušit
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteCollection(col.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Smazat
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ) : (
                              <span
                                className="justify-self-stretch text-center text-xs tabular-nums text-muted-foreground leading-none" // ← plná šířka buňky + center
                                title="Počet otevřených úkolů"
                              >
                                {taskCounts[col.id] ?? 0}
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>



              </div>
            </div>
          </div>

          {/* Vlastní obsah vpravo */}
          <div className="flex flex-col w-full mx-4 md:mx-6 text-foreground">
            {/* Titulek */}
            <div className="flex flex-col mb-8 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RxHamburgerMenu
                    onClick={() => setOpenSide(true)}
                    className={`${openSide && "hidden"} text-xl`}
                  />
                  <h1 className={`text-2xl text-foreground font-semibold px-2 py-1.5 ${openSide ? "pl-0" : "ml-4"}`}>
                    {selectedCollectionName || "Todo App"}
                  </h1>
                </div>
                <div>
                  {/* <div className="hidden md:inline-flex "> */}
                  <div className="inline-flex ">
                    <ThemeSwitcher className=""/> 
                  </div>
                  {/* <div className="dropdown">
                    <label
                      className="inline-flex items-center w-fit px-4"
                      tabIndex={0}
                    >
                      <IoFilterSharp className="mr-1 text-lg" />
                      Filtr
                    </label>
                    <div className="dropdown-menu dropdown-menu-bottom-left">
                    </div>
                  </div> */}
                </div>
              </div>
              <span
                className={`hidden ${openSide ? "pl-2" : "pl-7"} text-xs`}
              >
                Zde bude dnešní den, datum
              </span>
            </div>

            {/* Tady se zobrazuje TaskPage */}
            {selectedFilter ? (
              <TaskPage filter={selectedFilter} />
            ) : selectedCollectionId ? (
              <TaskPage taskID={selectedCollectionId} />
            ) : (
              <p>Vyber kolekci nebo filtr...</p>
            )}
            
            {/* Footer */}
            {/* <div className="mx-auto w-full max-w-screen-xl gap-6 pt-4 pb-2 md:pt-16 md:pb-4 px-1">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400">Aplikaci vytvořil Denis G.</p>
              </div>
            </div> */}
          </div>