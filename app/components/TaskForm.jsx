//todo Přidat lepší validaci formuláře

const TaskForm = ({
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

  return (
    <>
      <input
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
      </div>
    </>
  );
};

export default TaskForm;
