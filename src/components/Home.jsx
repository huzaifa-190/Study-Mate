import { React, useEffect, useState } from 'react';

import { IoIosAddCircle } from 'react-icons/io';
import { FaChevronRight } from 'react-icons/fa';
import { FaChevronLeft } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { PiSignOutBold } from 'react-icons/pi';
import { MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

import TaskCard from './TaskCard';
import TaskInfoModal from './TaskInfoModal';
import FilterDropDown from './FilterDropDown';
import Header from './Header';
import NoInernet from './NoInernet';
import TasksLoader from './TasksLoader';
import useAuth from '../hookss/useAuth';
import useFireStore from '../hookss/useFireStore';

import { useToDoContext } from '../contexts/ToDoContext';

function Home() {
  const { tasks, fetchingData } = useToDoContext();
  const { currentUser } = useAuth();
  const { tags } = useFireStore();
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilterTag, setCurrentFilterTag] = useState('All');
  const [isScrollToTopBtnVisible, setIsScrollToTopBtnVisible] = useState(false);

  // ---------------------------------------------Filtered tasks along with on search query----------------------------------------
  const filteredTasks = tasks?.filter((task) => {
    console.log('Filtering Tasks ...', task);
    if (currentFilterTag?.toLowerCase() == 'all') {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (currentFilterTag?.toLowerCase() == 'pending') {
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.completed
      );
    } else if (currentFilterTag?.toLowerCase() == 'completed') {
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        task.completed
      );
    } else {
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        currentFilterTag?.toLowerCase() == task?.tag?.toLowerCase()
      );
    }
  });

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 90) {
      setIsScrollToTopBtnVisible(true);
    } else {
      setIsScrollToTopBtnVisible(false);
    }
  };

  // Scroll to top when button is clicked

  const scrollToTop = async () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  /* -------------------------------------------------------------- RETURN -------------------------------------------------- */

  return (
    <div className="flex-col h-full w-full items-center justify-center px-2 sm:px-10 ">
      {/* -------------------------------------------------------------- Search-bar & filter container -------------------------------------------------- */}
      <div className="flex items-start justify-center gap-4 mt-5 sm:mt-10 mb-6 px-4 animate-slidetoleftfade ">
        {/* FILTER DROPDOWN FOR >= LG-Screen SIZES*/}
        <button className="mr-auto hidden md:flex  ">
          <FilterDropDown
            tagOptions={tags}
            selectedTag={currentFilterTag}
            onTagChange={(value) => setCurrentFilterTag(value)}
          />
        </button>
        <div className="sm:mr-auto flex w-full lg:justify-center items-center gap-4  ">
          <div className="searchField-container flex items-center justify-center">
            <input
              type="text"
              id="searchField"
              placeholder="search for tasks ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="searchField mr-auo"
            />
            <button
              className={`btn animate-openModal ${
                searchQuery.length > 0 ? 'flex' : 'hidden'
              }`}
              onClick={() => setSearchQuery('')}
              title="clear"
            >
              <RxCross2 size={24} color="grey" />
            </button>
          </div>

          <button
            title="Add new task"
            onClick={() => setAddTaskModalVisible(true)}
            className="btn "
          >
            <IoIosAddCircle
              size={45}
              className="text-purple-800 dark:text-white"
            />
          </button>
        </div>
      </div>

      {/*----------------------------------------------------------------- FILTER DROP-DOWN Div FOR SM-Screen SIZES------------------------------------------------------------ */}
      <button className="btn flex md:hidden px-4 animate-slidetoleftfade">
        <FilterDropDown
          tagOptions={tags}
          selectedTag={currentFilterTag}
          onTagChange={(value) => setCurrentFilterTag(value)}
        />
      </button>
      {/*----------------------------------------------------------------- Tasks Table Div ------------------------------------------------------------ */}
      {fetchingData ? (
        <TasksLoader />
      ) : !navigator.onLine ? (
        <NoInernet />
      ) : filteredTasks.length == 0 ? (
        <h1 className="flex w-full h-72 justify-center items-center text-2xl sm:text-4xl dark:text-white text-black font-bold  ">
          " No such tasks 🗂️"
        </h1>
      ) : (
        <div className="flex flex-col w-full items-center gap-6 p-4  animate-slideupfade">
          {filteredTasks
            ?.slice()
            .reverse()
            .map((task) => (
              <TaskCard task={task} key={task.id} />
            ))}

          {/*----------------------------------------------------------------- Scroll To Top Button ------------------------------------------------------------ */}
          {isScrollToTopBtnVisible ? (
            <button
              className="scroll-to-top-btn animate-bounceUp"
              onClick={() => scrollToTop()}
            >
              <MdOutlineKeyboardDoubleArrowUp size={30} color="white" />
            </button>
          ) : null}

          {/*----------------------------------------------------------------- Botton LEFT-RIGHT Buttons Div ------------------------------------------------------------ */}
          {/* <div className=" flex w-full h-40 sm:h-20 items-center justify-evenly">
            <button title="prev" className="btn">
              <FaChevronLeft size={28} />
            </button>

            <button title="next" className="btn">
              <FaChevronRight size={28} />
            </button>
          </div> */}
        </div>
      )}

      {addTaskModalVisible ? (
        // <div>
          <TaskInfoModal
            heading="Create Task"
            view="create"
            onClose={() => setAddTaskModalVisible(false)}
          />
        // </div>
      ) : null}
    </div>
  );
}

export default Home;
