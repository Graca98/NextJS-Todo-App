

const TaskForm = ({ formState, handleKeyDown, task, setTask, handleSubmit }) => {
  return (<>
    <input className="modal-state" id="modal-newTask" type="checkbox" />
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
          </div>
          <div className="form-field pt-3">
            <div className="form-control mx-auto">
              <label
                // type="button"
                onClick={handleSubmit}
                className="btn btn-primary w-32 "
                htmlFor="modal-newTask"
              >
                Vložit
              </label>
              <label
                htmlFor="modal-newTask"
                className="btn bg-gray-200 text-black w-32"
              >
                Zrušit
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default TaskForm