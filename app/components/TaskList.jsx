import Task from "./Task";

const TaskList = ({ tasks, handleChange, handleDelete, handleEditBtn }) => {


  return (<>
    <h2 className="text-xl font-semibold">
      {tasks.filter((oneTask) => !oneTask.status).length > 0
        ? "Seznam úkolů"
        : ""}
    </h2>

    {
      tasks
        .filter((oneTask) => !oneTask.status)
        .map((oneTask) => (
          <Task
            key={oneTask.id}
            taskText={oneTask.text}
            change={() => handleChange(oneTask.id)}
            status={oneTask.status}
            deleteTask={() => handleDelete(oneTask.id)}
            modal="modal-edit"
            editTask={() => handleEditBtn(oneTask.id)}
          />
        ))
    }

    <h2 className="text-xl font-semibold mt-12">
      {tasks.filter((oneTask) => oneTask.status).length > 0
        ? "Dokončeno"
        : ""}
    </h2>
    {
      tasks
        .filter((oneTask) => oneTask.status)
        .map((oneTask) => (
          <Task
            key={oneTask.id}
            taskText={oneTask.text}
            change={() => handleChange(oneTask.id)}
            status={oneTask.status}
            deleteTask={() => handleDelete(oneTask.id)}
            modal="modal-edit"
            editTask={() => handleEditBtn(oneTask.id)}
          />
        ))
    }
  </>)
}

export default TaskList