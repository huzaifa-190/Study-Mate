import React, { useState, useEffect, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { X } from "lucide-react";

import { useToDoContext } from "../contexts/ToDoContext";
import useFireStore from "../Hooks/useFireStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loaderCss = {};

function TaskInfoModal({
  heading = "Task",
  task = {},
  onClose,
  id = "",
  view = "",
}) {
  const {
    tasks,
    UpdateTags,
    UpdateTask,
    RemoveTask,
    toggleComplete,
    AddTask,
    WriteTags,
    writingData,
  } = useToDoContext();
  const { tags } = useFireStore();

  const [title, setTitle] = useState(task.title || "");
  const [tag, setTag] = useState(task.tag || "");
  const [tagColor, setTagColor] = useState("#62ff1f");
  const [formErrors, setFormErrors] = useState({
    title: false,
    tag: false,
    tagColor: false,
  });

  const bgRef = useRef();

  useEffect(() => {
    if (task && task.tag) {
      const foundTag = tags.find(
        (tg) => tg.title.toLowerCase().trim() === task.tag.toLowerCase().trim()
      );
      setTagColor(foundTag?.tagColor || task.tagColor || "#62ff1f");
    }
  }, [tags, task]);

  const closeOnBgTap = (e) => {
    if (bgRef.current === e.target) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {
      title: title.trim() === "",
      tag: tag.trim() === "",
      tagColor: tagColor.trim() === "",
    };

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      if (navigator.onLine) {
        const newTask = {
          tag: tag.trim(),
          tagColor,
          title: title.trim(),
          completed: false,
        };
        const newTag = { title: tag.toLowerCase().trim(), tagColor };

        if (view.toLowerCase() === "create") {
          AddTask(newTask);
          console.log("Added task, now adding Subject...");

          const tagTitles = tags.map((tg) => tg.title.toLowerCase().trim());
          const tagExists = tagTitles.includes(newTag.title);

          if (!tagExists) {
            WriteTags(newTag);
            toast.success("Task created", { autoClose: 1000 });
          } else {
            const prevTag = tags.find(
              (tg) => tg.title.toLowerCase().trim() === newTag.title
            );
            if (prevTag && prevTag.tagColor !== newTag.tagColor) {
              UpdateTags(prevTag.id, "Tasks", newTag);
              // toast.success("Task and Subject updated", { autoClose: 1000 });
            }
          }
        } else {
          UpdateTask({ id, docName: "Tasks", task: newTask });
          const tagExists = tags.some(
            (tg) => tg.title.toLowerCase().trim() === newTag.title
          );
          if (!tagExists) {
            WriteTags(newTag);
          } else {
            const prevTag = tags.find(
              (tg) => tg.title.toLowerCase().trim() === newTag.title
            );
            if (prevTag && prevTag.tagColor !== newTag.tagColor) {
              UpdateTags(prevTag.id, "Tasks", newTag);
            }
          }
        }

        toast.success("Task updated", { autoClose: 1000 });
        onClose();
      } else {
        toast.error("Check your internet connection");
      }
    } else {
      console.log("Form errors (empty fields):", formErrors);
    }
  };

  return (
    <div
      className="flex w-screen h-screen items-center justify-center fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-20"
      onClick={closeOnBgTap}
      ref={bgRef}
    >
      <form
        className="flex flex-col w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] p-8 sm:p-8 rounded-3xl bg-white z-10 animate-openModal"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row mb-4 items-center">
          <h1 className="text-xl sm:text-2xl ml-auto font-bold text-gray-800">
            {heading}
          </h1>
          <button className="ml-auto" onClick={onClose} type="button">
            <X color="#d12323" size={28} />
          </button>
        </div>

        <label htmlFor="titleField" className="labels">
          Title *
        </label>
        <input
          readOnly={view.toLowerCase() === "readonly"}
          title={view.toUpperCase()}
          type="text"
          id="titleField"
          placeholder="Use a relative title for your task"
          value={title}
          // required
          onChange={(e) => {
            setTitle(e.target.value);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              title: false,
            }));
          }}
          className={`modalInputFields focus w-full textEllipsis ${formErrors.title ? "requiredField" : ""
            }`}
        />
        {formErrors.title && (
          <h1 className="requiredFieldLabel">Field Required</h1>
        )}

        <label htmlFor="tagField" className="labels">
          Subject *
        </label>
        <input
          list="browsers"
          readOnly={view.toLowerCase() === "readonly"}
          title={view.toUpperCase()}
          type="text"
          id="tagField"
          placeholder="Maths, Englis etc."
          value={tag}
          // required
          onChange={(e) => {
            setTag(e.target.value);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              tag: false,
            }));
            const foundTag = tags.find(
              (tagg) => tagg.title.toLowerCase() === e.target.value.toLowerCase()
            );
            setTagColor(foundTag?.tagColor || "#ffffff");
          }}
          className={`modalInputFields ${formErrors.tag ? "requiredField" : ""
            }`}
        />
        <datalist id="browsers">
          {tags.map((tag) => (
            <option key={tag.id} value={tag.title} />
          ))}
        </datalist>
        {formErrors.tag && (
          <h1 className="requiredFieldLabel">Field Required</h1>
        )}

        <label htmlFor="tagColor" className="labels">
          {view.toLowerCase() === "create" && "Select"} subject color *
        </label>
        <input
          type="color"
          id="tagColor"
          value={tagColor}
          disabled={view.toLowerCase() === "readonly"}
          onChange={(e) => {
            setTagColor(e.target.value);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              tag: false,
            }));
          }}
          className={`${view.toLowerCase() === "readonly"
            ? "cursor-not-allowed"
            : "cursor-pointer"
            }`}
        />
        <h1>{tagColor}</h1>

        {view.toLowerCase() !== "readonly" && (
          <button
            className="btn w-52 sm:w-60 lg:w-72 p-4 mt-2 text-white bg-lightPurp rounded-md mx-auto bg-opacity-65 focus:outline-none"
            type="submit"
          >
            {writingData ? (
              <div className="flex gap-2 items-center justify-center sm:text-lg">
                <span className="sm:text-lg">
                  {view.toLowerCase() === "create" ? "Adding" : "Saving"}
                </span>
                <ClipLoader
                  color={"white"}
                  cssOverride={loaderCss}
                  size={20}
                  aria-label="Adding new task ..."
                  data-testid="loader"
                />
              </div>
            ) : view === "editable" ? (
              "Save"
            ) : (
              "CREATE"
            )}
          </button>
        )}
      </form>
    </div>
  );
}

export default TaskInfoModal;
