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

  // Hlídá, aby uživatel mohl zadat pouze dnešní a budoucí datum
  function getMinDateToday() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1; // getMonth() vrací měsíc od 0 do 11
    let year = date.getFullYear();

    // Přidání vedoucí nuly pro den a měsíc pokud je potřeba
    let formattedDay = day < 10 ? `0${day}` : day;
    let formattedMonth = month < 10 ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
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
            min={getMinDateToday()}
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
    </>
  );
};

export default AddTask;
