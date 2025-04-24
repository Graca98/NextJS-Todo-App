import TaskCard from "./TaskCard";

const TaskList = ({
  tasks,
  handleChange,
  handleDelete,
  handleEditBtn,
  setOpenEditModal,
}) => {
  //todo GET, momentálně problém s client componentou a async/await
  // const url = "http://localhost:3000/api/Tasks"

  // const getTasks = async () => {
  //   try {
  //     const res = await fetch(url, {
  //       cache: "no-store"
  //     })
  //     return res.json()
  //   } catch(error) {
  //     console.log("Failed to get tasks", error)
  //   }
  // }

  return (
    <>
      <h2 className="text-xl font-semibold">
        {tasks.filter((task) => !task.is_completed).length > 0 ? "Seznam úkolů" : ""}
      </h2>

      {tasks
        .filter((task) => !task.is_completed)
        .map((task) => (
          <TaskCard
            key={task.id}
            title={task.name}
            status={task.is_completed}
            timeToComplete={task.due_date}
            change={() => handleChange(task.id)}
            deleteTask={() => handleDelete(task.id)}
            editTask={() => handleEditBtn(task.id)}
            setOpenEditModal={setOpenEditModal}
          />
        ))}

      <h2 className="text-xl font-semibold mt-8">
        {tasks.filter((task) => task.is_completed).length > 0 ? "Dokončeno" : ""}
      </h2>
      {tasks
        .filter((task) => task.is_completed)
        .map((task) => (
          <TaskCard
            key={task.id}
            title={task.name}
            status={task.is_completed}
            timeToComplete={task.due_date}
            change={() => handleChange(task.id)}
            deleteTask={() => handleDelete(task.id)}
            editTask={() => handleEditBtn(task.id)}
            setOpenEditModal={setOpenEditModal}
          />
        ))}
    </>
  );
};

export default TaskList;
