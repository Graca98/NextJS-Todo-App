import TaskCard from "./TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FaSquareCheck } from "react-icons/fa6";

const TaskList = ({
  tasks,
  handleChange,
  handleDelete,
  handleEditBtn,
  editTaskId,
  editValue,
  setEditValue,
  handleEditSave,
  handleEditCancel,
  isMobile,
  setOpenEditModal,
  isLoading,
  isLoadingTasks,
  isLoadingCollections,
}) => {

  return (
  <>
    {/* Nadpis */}
      {isLoadingTasks || isLoadingCollections ? (
        <Skeleton className="h-6 w-40 mb-4" />
      ) : tasks.filter((task) => !task.is_completed).length > 0 ? (
        <h2 className="text-xl text-foreground font-semibold">
          Seznam úkolů
        </h2>
      ) : (
        <h2 className="text-xl text-foreground font-semibold flex items-center gap-2">
          <FaSquareCheck className="text-green-500" />
          Vše je hotovo. Přidejte nový úkol.
        </h2>
      )}

    {/* Obsah */}
    {isLoading ? (
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-background"
          >
            <div className="flex items-center gap-3 w-full">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <>
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
              isEditing={editTaskId === task.id}
              editValue={editValue}
              setEditValue={setEditValue}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
              isMobile={isMobile}
            />
          ))}

        {tasks.filter((task) => task.is_completed).length > 0 && (
          <>
            <h2 className="text-xl text-foreground font-semibold mt-8">
              Dokončeno
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
                  isEditing={editTaskId === task.id}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEditSave={handleEditSave}
                  handleEditCancel={handleEditCancel}
                  isMobile={isMobile}
                />
              ))}
          </>
        )}
      </>
    )}
  </>
)};

export default TaskList;
