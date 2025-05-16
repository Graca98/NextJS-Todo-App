import TaskCard from "./TaskCard";
import { FaSquareCheck } from "react-icons/fa6";

const TaskList = ({
  tasks,
  handleChange,
  handleDelete,
  handleEditBtn,
  setOpenEditModal,
}) => {

  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {tasks.filter((task) => !task.is_completed).length > 0 
          ? "Seznam úkolů" 
          : <>
              <span><FaSquareCheck className="text-green-500"/></span> Vše je hotovo. Přidejte nový úkol.
            </>
        }
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
