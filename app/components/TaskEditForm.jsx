

const TaskEditForm = ({ tempID, editValue, setEditValue, handleFocus, handleEdit }) => {
  return (<>
    <input className="modal-state" id="modal-edit" type="checkbox" />
    <div className="modal px-0">
      <label className="modal-overlay" htmlFor="modal-edit"></label>
      <div className="modal-content flex flex-col w-screen md:w-6/12 max-w-screen-sm gap-5 bg-white">
        <div className="form-group">
          <div className="form-field">
            <label className="form-label text-lg text-gray-700">
              Upravte úkol
            </label>
            <input
              placeholder="Upravte úkol"
              type="text"
              className="input max-w-full bg-white text-black"
              onChange={(e) => setEditValue(e.target.value)}
              onFocus={handleFocus}
              value={editValue}
            />
            <label className="form-label">
              <span className="form-label-alt">Neplatný formát</span>
            </label>
          </div>

          <div className="flex gap-3 w-full mx-auto justify-center">
            <label
              onClick={() => handleEdit(tempID)}
              className="btn btn-success w-32"
              htmlFor="modal-edit"
            >
              Uložit
            </label>
            <label
              htmlFor="modal-edit"
              className="btn bg-gray-200 text-black w-32"
            >
              Zrušit
            </label>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default TaskEditForm