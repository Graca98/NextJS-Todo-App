//todo Přidat lepší validaci formuláře

const AddTask = ({
  openTaskModal,
  setOpenTaskModal,
  formState,
  setFormState,
  task,
  setTask,
  handleSubmit,
  taskDate,
  setTaskDate,
}) => {
  const handleCancelBtn = () => {
    setTask("");
    setOpenTaskModal(false);
    setFormState({
      inputLabel: "",
      spanLabel: "",
      formText: "",
    });
    setTaskDate("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancelBtn();
    }
  };

  const handleDate = (e) => {
    setTaskDate(e.target.value);
  };

  function getUSToday() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1; // getMonth() vrací měsíc od 0 do 11
    let year = date.getFullYear();

    // Přidání vedoucí nuly pro den a měsíc pokud je potřeba
    let formattedDay = day < 10 ? `0${day}` : day;
    let formattedMonth = month < 10 ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`; // správný formát pro HTML input date
  }

  return (
    <>
      <label
        htmlFor="addTask"
        className={`flex justify-start cursor-pointer items-center gap-2 shadow-md p-2 bg-white w-full mb-6`}
      >
        <input
          type="checkbox"
          className="checkbox checkbox-success checkbox-lg bg-white w-6 flex-shrink-0"
          checked={false}
          readOnly
        />
        <div className="flex flex-col lg:flex-row lg:items-center ml-1 flex-grow lg:gap-6 lg:justify-start">
          <div className="flex flex-col lg:basis-8/12">
            <input
              placeholder="Přidat úkol"
              type="text"
              id="addTask"
              className={`input input-solid max-w-full bg-white text-black px-0 ${formState.inputLabel}`}
              onKeyDown={handleKeyDown}
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <label className="form-label px-0">
              <span className={`form-label-alt ${formState.spanLabel}`}>
                {formState.formText}
              </span>
            </label>
          </div>
          <input
            type="date"
            value={taskDate}
            onChange={handleDate}
            onKeyDown={handleKeyDown}
            id="taskId"
            min={getUSToday()}
            className="max-w-28 lg:basis-3/12 text-gray-500 text-xs lg:text-sm"
          ></input>
        </div>
        <div className="flex justify-end lg:basis-1/12">
          <button
            // type="button"
            onClick={handleSubmit}
            className="btn btn-ghost btn-md px-2"
          >
            Přidat
          </button>
        </div>
      </label>

      {/* <input
        className="modal-state"
        id="modal-newTask"
        type="checkbox"
        onChange={() => setOpenTaskModal(!openTaskModal)}
        checked={openTaskModal}
      />
      <div className="modal px-0">
        <label className="modal-overlay" htmlFor="modal-newTask"></label>
        <div className="modal-content flex flex-col w-screen md:w-9/12 max-w-screen-sm gap-5 bg-white mb-40 md:mb-96">
          <div className="form-group">
            <div className="form-field">
              <label className="form-label text-lg text-gray-700">
                Zadejte úkol
              </label>
              <input
                placeholder="Vynést odpadky"
                type="text"
                className={`input max-w-full bg-white text-black ${formState.inputLabel}`}
                onKeyDown={handleKeyDown}
                onChange={(e) => setTask(e.target.value)}
                value={task}
              />
              <label className="form-label">
                <span className={`form-label-alt ${formState.spanLabel}`}>
                  {formState.formText}
                </span>
              </label>
              <label htmlFor="taskId">Datum splnění</label>
              <input
                type="date"
                value={taskDate}
                onChange={handleDate}
                id="taskId"
                className="max-w-6/12 md:max-w-36"
              ></input>
              <label>{taskDate}</label>
            </div>
            <div className="form-field pt-3">
              <div className="form-control mx-auto">
                <button
                  // type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary w-32 "
                >
                  Vložit
                </button>
                <button
                  // htmlFor="modal-newTask"
                  className="btn bg-gray-200 text-black w-32"
                  onClick={handleCancelBtn}
                >
                  Zrušit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default AddTask;
