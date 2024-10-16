import "./index.css";
import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation, } from "react-router-dom";
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import ChatWithAI from "./pages/ChatWithAI";
import TimeTableGenerator from './pages/TimeTableGenerator';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components Imports
import LayOut from "./components/Layout/LayOut.jsx";
import Index from "./components/Index.jsx";
import AuthProtectedRoute from "./components/Auth/AuthProtectedRoute.jsx";
import HomeProtectedRoute from "./components/Home/HomeProtectedRoute.jsx";
import TasksLoader from "./components/TasksLoader.jsx";
import { ToDoProvider } from "./contexts/ToDoContext";
import useFireStore from "./Hooks/useFireStore.js"


// Lazy loaded components
const SignUp = lazy(() => import("./components/Auth/SignUp.jsx"));
const SignIn = lazy(() => import("./components/Auth/SignIn.jsx"));
const Home = lazy(() => import("./components/Home.jsx"));

// Helper component to wrap Home route with ToDoProvider
function ToDoWrapper({ children }) {
  const {
    upDateDoc,
    deleteDoc,
    toggleCompleted,
    writeData,
    writeTags,
    updateTags,
    tasks,
    setTasks,
    fetchingData,
    writingData,
  } = useFireStore();

  const WriteTags = async (tag) => await writeTags(tag);
  const UpdateTags = async (id, docName, tag) => await updateTags(id, docName, tag);
  const AddTask = async (task) => await writeData(task);
  const RemoveTask = (id, docName) => deleteDoc(id, docName);
  const UpdateTask = ({ id, docName, task }) => upDateDoc(id, docName, task);
  const toggleComplete = ({ id, docName, task }) => {
    const toggledTask = { ...task, completed: !task.completed };
    toggleCompleted(id, docName, toggledTask);
  };

  return (
    <ToDoProvider
      value={{
        tasks,
        setTasks,
        AddTask,
        WriteTags,
        UpdateTags,
        UpdateTask,
        RemoveTask,
        toggleComplete,
        fetchingData,
        writingData,
      }}
    >
      {children}
    </ToDoProvider>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <div className="flex h-screen w-screen items-center justify-center" >
      <TasksLoader />
    </div>
  ) : (
    <>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route
            index
            element={
              <HomeProtectedRoute>
                <Index />
              </HomeProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <HomeProtectedRoute>
                <Suspense fallback={<TasksLoader />}>
                  <SignUp />
                </Suspense>
              </HomeProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <HomeProtectedRoute>
                <Suspense fallback={<TasksLoader />}>
                  <SignIn />
                </Suspense>
              </HomeProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {
        pathname.includes("sign-in") || pathname.includes("sign-up") || pathname.includes('home') || pathname == "/" ? null :
          <DefaultLayout>
            <Routes>
              <Route
                path='/dashboard'
                element={
                  <>
                    <PageTitle title="Study Mate - Dashboard" />
                    <ECommerce />
                  </>
                }
              />
              <Route
                path="/timetable-generator"
                element={
                  <>
                    <PageTitle title="Study Mate - TimeTable Generator" />
                    <TimeTableGenerator />
                  </>
                }
              />
              <Route
                path="/chat-with-ai"
                element={
                  <>
                    <PageTitle title="Study Mate - Chat with AI" />
                    <ChatWithAI />
                  </>
                }
              />
              <Route
                path="task-manager"
                element={
                  <AuthProtectedRoute>
                    <ToDoWrapper>
                      <Suspense fallback={
                        <div className="flex h-full w-full items-center justify-center" >
                          <TasksLoader />
                        </div>
                      }>
                      <>
                        <PageTitle title="Study Mate - Task Manager" />
                        <Home />
                      </>
                      </Suspense>
                    </ToDoWrapper>
                  </AuthProtectedRoute>
                }
              />
            </Routes>
          </DefaultLayout>
      }
    </>
  );
}

export default App;
