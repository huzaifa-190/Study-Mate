import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../Hooks/useAuth";

function SignUp() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onsubmit = ()=>{
    navigate('sign-in')
  }
  return (
    <div className="flex-1 flex-col h-full w-screen items-center justify-center py-4 px-4 sm:px-10 ">
      <div className="flex flex-col items-center justify-center h-[85%] w-full gap-5 ">
        <h1 className="font-bold text-4xl sm:text-7xl  text-black">Hello!</h1>
        <h1 className="text-xl mb-10 text-center ">
          To manage your daily tasks, you need to Login first !
        </h1>
        <button className="btn bg-purple-800 rounded-md text-white w-60 sm:w-72 py-4 animate-pulse"
          onClick={onsubmit}
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default SignUp;
