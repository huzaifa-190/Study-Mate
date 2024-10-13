import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

function SignUp() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });

  // ----------------------------------------------------- METHODS ----------------------------------------------------
  const onSubmit = async (event) => {
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
          const user = await signUp(email, password);
          setEmail("");
          setPassword("");
          navigate("/dashboard");
          toast.success(`Signed Up Successfully with : ${user.email}`, {
            autoClose: 1500,
          });
        } catch (error) {
          toast.error(
            `Failed to Sign Up :: ${error.message}`
          );
        }
      } else {
        toast.warn("Check your internet connection.");
      }
    } else {
      console.log("form errors i.e empty fields -> ", formErrors);
    }
  };

  // ---------------------------------------------------- RETURN ------------------------------------------------------

  return (
    <div className="flex-1 flex-col w-screen items-center justify-center py-4 mt-10 sm:px-10 animate-slidetoleftfade">
      <div className="flex flex-col items-center sm:justify-center h-full w-full gap-5">
        <h1 className="text-4xl font-bold text-black mb-4">Sign Up!</h1>

        <div
          className={`input-field-container ${formErrors.email ? "requiredField" : ""
            } `}
        >
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors({
                ...formErrors,
                email: false,
              });
            }}
            placeholder="Email"
            className={`input-fields focus textEllipsis`}
          />
        </div>

        <div
          className={`input-field-container flex items-center ${formErrors.password ? "requiredField" : ""
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
            placeholder="Password"
            className={`input-fields focus textEllipsis`}
          />
          <button
            type="button"
            className="btn flex items-center justify-center px-2"
            onClick={() => setPasswordShown(!passwordShown)}
          >
            {passwordShown ? <IoMdEyeOff size={28} /> : <IoMdEye size={28} />}
          </button>
        </div>

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
              aria-label="Signing Up..."
              data-testid="loader"
            />
          ) : (
            "Sign Up"
          )}
        </button>

        <h1 className="mt-5">
          Already have an account?
          <button
            className="font-bold ml-2 btn"
            onClick={() => navigate("/sign-in")}
          >
            Log In
          </button>
        </h1>
      </div>
    </div>
  );
}

export default SignUp;
