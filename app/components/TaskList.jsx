import Task from "./Task";

const TaskList = ({ tasks, handleChange, handleDelete, handleEditBtn, setOpenEditModal }) => {

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
            status={oneTask.status}
            taskTime={oneTask.time}
            change={() => handleChange(oneTask.id)}
            deleteTask={() => handleDelete(oneTask.id)}
            editTask={() => handleEditBtn(oneTask.id)}
            setOpenEditModal={setOpenEditModal}
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
            status={oneTask.status}
            taskTime={oneTask.time}
            change={() => handleChange(oneTask.id)}
            deleteTask={() => handleDelete(oneTask.id)}
            editTask={() => handleEditBtn(oneTask.id)}
            setOpenEditModal={setOpenEditModal}
          />
        ))
    }
  </>)
}

export default TaskList