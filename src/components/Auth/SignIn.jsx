import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import useAuth from "../../hooks/useAuth";
import { IoEllipseSharp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function SignUp() {
  const navigate = useNavigate();
  const { signIn, loading, Google_Auth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false)
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });

  // ----------------------------------------------------- METHDOS ----------------------------------------------------
  const onSubmit = async () => {
    event.preventDefault();
    const newErrors = {
      email: email.trim() === "",
      password: password.trim() === "",
    };

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      if (navigator.onLine) {
        try {
          const user = await signIn(email, password);
          setEmail("");
          setPassword("");
          // toast.success(`Signed In Successfully with : ${user.email}`, {
          //   autoClose: 1500,
          // });
          navigate("/task-manager", { replace: true });
          // Clear history entries beyond the current page
          window.history.pushState(null, "", window.location.href);
          window.onpopstate = () => window.history.go(1);
        } catch (error) {
          if (error.message == "Firebase: Error (auth/invalid-credential).") {
            toast.error(`Invalid credentials , check email or password`, {
              autoClose: 1500,
            });
          } else if (
            error.message ==
            "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
          ) {
            toast.warn(
              `Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.`
            );
          } else {
            toast.error(`Failed to Sign In ::  ${error.code}`),
              { autoClose: 1500 };
          }
        }
      } else {
        toast.warn("Chek your internet");
      }
    } else {
      console.log("form errors i.e empty fields -> ", formErrors);
    }
  };

  const handleGoogleSignIn = async () => {
    const user = await Google_Auth()
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user); // Store the user info in the state
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
      });
  };

  // ---------------------------------------------------- RETURN -----------------------------------------------
  return (
    <div className="flex-1 flex-col h-full w-screen items-center justify-center py-4 mt-10  sm:px-10 overflow-x-hidden animate-slidetorightfade">
      <div className="flex flex-col items-center sm:justify-center h-full w-full gap-5 ">
        <h1 className="text-4xl font-bold text-black mb-4">Sign In !</h1>
        <div
          className={`input-field-container flex items-center focus  ${formErrors.email ? "requiredField" : ""
            }`}
        >
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors({
                ...formErrors,
                email: false,
              });
            }}
            placeholder="Email"
            className={` input-fields  textEllipsis `}
          />
        </div>
        <div
          className={`input-field-container flex items-center  ${formErrors.password ? "requiredField" : ""
            }`}
        >
          <input
            type={passwordShown ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors({
                ...formErrors,
                password: false,
              });
            }}
            placeholder="password"
            className={`input-fields textEllipsis `}
          />
          <button className="btn flex items-center justify-center px-2" onClick={() => setPasswordShown(!passwordShown)}>
            {passwordShown ? <IoMdEyeOff size={28} /> : <IoMdEye size={28} />}
          </button>
        </div>

        {/* ---------------------------------------- SUBMIT BUTTON --------------------------------------------- */}

        <button
          disabled={loading}
          className={`btn bg-purple-800 rounded-md text-white w-72 sm:w-72 py-4 ${loading ? "opacity-60 cursor-not-allowed" : "opacity-100"
            }`}
          onClick={onSubmit}
        >
          {loading ? (
            <ClipLoader
              color={"white"}
              size={20}
              aria-label="Signing In ..."
              data-testid="loader"
            />
          ) : (
            "Sign In"
          )}
        </button>
        {/* Separator */}
        <div className="flex flex-col items-center justify-center w-full max-w-xs my-2">
          {/* <hr className="w-full border-gray-300" /> */}
          <span className="px-3 text-gray-500">OR</span>
          <span className="px-3 text-gray-500">sign in with Google</span>
          {/* <hr className="w-full border-gray-300" /> */}
        </div>



        <button
          disabled={loading}
          className={`btn w-72 py-0 ${loading ? "opacity-60" : "opacity-100"
            }`}
          onClick={handleGoogleSignIn}
        >
          {loading ? (
            <ClipLoader
              color={"white"}
              size={20}
              aria-label="Signing In ..."
              data-testid="loader"
            />
          ) : <img
            src="/google.png" // Path to image in public folder
            alt="icon"
            className="w-10 h-10 inline-block mr-2" // Adjust size and spacing
          />
          }
        </button>



        <h1 className="mt-5">
          Don't have an account ?
          <button
            className="font-bold ml-2 btn "
            onClick={() => navigate("/sign-up")}
          >
            SignUp
          </button>
        </h1>
      </div>
    </div>
  );
}

export default SignUp;
