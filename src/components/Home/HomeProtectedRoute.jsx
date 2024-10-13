import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import { useEffect, useRef } from "react";

function HomeProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const toastId = useRef(null);

  // Debounce function to prevent multiple toasts
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const showToast = debounce(() => {
    if (!toastId.current) {
      toastId.current = toast.success("Welcome to Home...",{autoClose:1000});
    }
  }, 300);

  useEffect(() => {
    if (currentUser && !loading) {
      showToast();
    }
  }, [currentUser, loading]);

  if (loading) return null;

  if (!currentUser) {
    return children;
  } else {
    return <Navigate to="/home" replace />;
  }
}

export default HomeProtectedRoute;
