import { React, useState } from "react";

import { MdEdit, MdDelete } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { PiTagChevronFill } from "react-icons/pi";

import { useToDoContext } from "../contexts/ToDoContext";
import useFireStore from "../Hooks/useFireStore";
import TaskInfoModal from "./TaskInfoModal";

// ------------------------------------------------------------------------------ MAIN FUNCTION ----------------------------------------------------------------
function TaskCard({ task }) {
  const { tasks, UpdateTask, RemoveTask, toggleComplete, AddTask } =
    useToDoContext();
  const {tags} = useFireStore()
  const [viewTaskModalVisible, setViewTaskModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const timee = new Date(2024, 7, 16);

  const onEdit = () => {
    setEditTaskModalVisible(true);
  };

  // ---------------------------------------------------------------- RETURN ----------------------------------------------------------------
  return (
    <div
      key={task.id}
      className={`flex w-full h-16 items-center text-black rounded-xl shadow-lg bg-transparent  `}
    >
      {/* // ----------------------------------------------------------------------------- LEFT BOX FOR CHECK-BOX & TITLE -------------------------------------------------------------------  */}
      <div
        className={`flex items-center gap-3 sm:gap-6 h-full w-[50%] md:w-[45%] px-4 rounded-l-xl ${
          task.completed ? "completedTask" : " bg-slate-100 "
        } `}
      >
        <input
          type="checkbox"
          name="isCompleted"
          id="isCompletedCheckBox"
          checked={task.completed}
          onChange={() => toggleComplete({id:task.id,docName:"Tasks",task})}
          className={`text-lightPurp h-8 cursor-pointer`}
          size={28}
        />

        <button
          onClick={() => setViewTaskModalVisible(true)}
          className={`btn textEllipsis text-sm sm:text-md `}
        >
          {task.title}
        </button>
      </div>

      {/* ----------------------------------------------------------------------------------  RIGHT BOX FOR OPTIONS ----------------------------------------------------------------------- */}
      <div
        className={`flex items-center justify-end gap-2 sm:gap-5 h-full w-[55%] px-4 rounded-r-xl ${
          task.completed ? "completedTask" : " bg-slate-100 "
        } `}
      >
        <button
          onClick={() => RemoveTask(task.id, "Tasks" )}
          className={`btn `}
          title="remove"
        >
          <MdDelete size={20} className="sm:size-6"  color="#8f40c4" />
        </button>

        <button
          className={`btn hover:-translate-y-1 ${
            task.completed ? "cursor-not-allowed " : ""
          } `}
          title="Edit"
          disabled={task.completed}
          onClick={() => onEdit()}
        >
          <MdEdit size={20} className="sm:size-6"  color="#8f40c4" />
        </button>
        <button
          className={`btn`}
          title="Info"
          onClick={() => setViewTaskModalVisible(true)}
        >
          <SlOptionsVertical size={20} className="sm:size-6"  color="#262626" />
        </button>
        <PiTagChevronFill size={25} className="sm:size-8"   color={tags.find(tg => tg.title.toLowerCase().trim() === task.tag.toLowerCase().trim())?.tagColor }/>
      </div>

      {/* ---------------------------------------------------------------------------------- EDIT TASK MODAL ----------------------------------------------------------------------- */}
      {editTaskModalVisible ? (
        <div>
          {/* {" "} */}
          <TaskInfoModal
            heading="Edit Task"
            id={task.id}
            task={task}
            view="editable"
            onClose={() => setEditTaskModalVisible(false)}
          />
        </div>
      ) : null}

      {/* ---------------------------------------------------------------------------------- VIEW TASK MODAL ----------------------------------------------------------------------- */}
      {viewTaskModalVisible ? (
        <div>
          {/* {" "} */}
          <TaskInfoModal
            heading="Task Info"
            // id={task.id}
            task={task}
            view="readonly"
            onClose={() => setViewTaskModalVisible(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default TaskCard;
