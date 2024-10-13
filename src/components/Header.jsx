import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { MdDarkMode } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";

import useAuth from "../Hooks/useAuth";
import useFireStore from "../Hooks/useFireStore";
import ConfirmModal from "./ConfirmModal";
import GenAi from "./GenAi.jsx"

export default function Header() {
  const { logOut, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // --------------------------------------------------------------- METHODS ----------------------------------------------------------------
  const signOut = async () => {
    event.preventDefault();
    try {
      const user = await logOut();
      // toast("Signed Out !", { autoClose: 1500 });
      navigate("/sign-in");
      // Clear history entries beyond the current page
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => window.history.go(1);
    } catch (error) {
      toast.error("Error signing out: ", error, { autoClose: 1500 });
    } finally {
      setShowConfirmationModal(false);
    }
  };
  const onSignOut = async () => {
    setShowConfirmationModal(true);
  };
  return (
    <div className="flex flex-col w-full px-2 sm:px-10 ">
      <div className="flex w-full  h-16 sm:h-24 ">
        {/* Left Div in Header containing Logo */}
        <button
          className="flex items-center gap-1 btn"
          onClick={() => location.reload()}
        >
          <h1 className="inner-white-shadow flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 p-4 rounded-full bg-purple-800 text-white border-purple-200 border-2   text-sm sm:text-md font-bold">
            Study
          </h1>
          <h1 className="text-md text-gray-700 sm:text-lg font-bold">Mate</h1>
        </button>

        {/* Right Div in Header containing email and avatar */}
        <div className="flex flex-wrap-reverse ml-auto items-center justify-end px-4 gap-5 sm:gap-5   ">
           
          {/* <GenAi/> */}


          <h2 className="flex sm:flex text-sm sm:text-lg font-semibold text-gray-600">
            {currentUser && currentUser.email} 
            {/* --- {currentUser && currentUser.uid} */}
          </h2>
          <button className="btn" title="dark mode">
            <MdDarkMode size={28} color="#333432" />
          </button>
          {/* <MdOutlineLightMode size={28} title="light mode" /> */}
          {currentUser && (
            <button
              className="btn hidden sm:flex"
              title="sign-out"
              onClick={() => onSignOut()}
            >
              <PiSignOutBold size={26} color="#333432" />
            </button>
          )}

          {/* ------------------------------------------------------ OVERLAY MODAL ------------------------------------------------- */}
          {showConfirmationModal && (
            <ConfirmModal
              onConfirm={signOut}
              onClose={() => setShowConfirmationModal(false)}
            />
          )}

          {/* LogOut button For Smaller Screen Sizes */}
        </div>
      </div>
      {currentUser && (
        <div className="flex sm:hidden w-full   pb-16   sm:pb-2 pt-1 items-center justify-end gap-4 px-4 ">
          {/* <h2 className="text-sm sm:text-xl font- text-gray-600">huzaifa190@gmail.com</h2> */}
          <button className="btn" title="sign-out" onClick={() => onSignOut()}>
            <PiSignOutBold size={26} color="#333432" />
          </button>
        </div>
      )}
    </div>
  );
}
