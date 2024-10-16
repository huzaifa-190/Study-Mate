import React from "react";
import { IoMdDoneAll } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";

export default function   FilterDropDown({
  tagOptions = [],
  selectedTag,
  onTagChange,
}) {
  return (
    <div className="flex flex-row h-10 items-center px-2  rounded-md space-x-2 bg-white">
      { selectedTag.toLowerCase() === 'completed' ? <IoMdDoneAll size='24' color="#28A745"/>  : selectedTag.toLowerCase() === 'pending' ?  <MdAccessTimeFilled size='28' color="#FFA500"/> :
      
      <div className={`h-4 w-4 sm:h-6 sm:w-6 rounded-full `} 
      style={{
          backgroundColor: `${
            selectedTag.toLowerCase() !== 'all' &&
            selectedTag.toLowerCase() !== 'completed' &&
            selectedTag.toLowerCase() !== 'pending'
            ? tagOptions.find((tag) => tag.title === selectedTag)?.tagColor
              : ''
          }`,
          border: `${
            selectedTag.toLowerCase() === 'all' ||
            selectedTag.toLowerCase() === 'completed' ||
            selectedTag.toLowerCase() === 'pending'
            ? '1px solid grey'
            : 'none'
            }`,
          }}
          />
        }
      

      <select
        className="h-8  pl-2 sm:pr-4 rounded-md cursor-pointer bg-transparent text-black text-
        active:outline-0 active:border-0  focus:outline-none transition-all duration-300 ease-linear"
        value={selectedTag}
        onChange={(e) => {
          onTagChange && onTagChange(e.target.value);
        }}
      >
        {/* Add default "All" option */}
        <option value="All" className="flex gap-4 text-sm bg-white  ">
          All
        </option>
        
        {tagOptions.map((tag) => (
          <option
            key={tag.id}
            value={tag.title}
            
            className="flex gap-4 text-sm bg-white p-0 bg-black "
          >
            {tag?.title?.charAt(0).toUpperCase() + tag?.title?.slice(1) || 'Untitled'}
          </option>
        ))}
        <option value="Pending" className="flex gap-4 text-sm bg-white bg-black">
          Pending
        </option>
        <option value="Completed" className="flex gap-4 text-sm bg-white bg-black">
          Completed
        </option>
      </select>
    </div>
  );
}
