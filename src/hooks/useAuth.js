import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup } from 'firebase/auth';
import {auth,provider} from "../DataBase/FirebaseConfig"
import { toast } from 'react-toastify';





// ------------------------------------------------------- MAIN ----------------------------------------------------

function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
// ------------------------------------------------------- METHODS ----------------------------------------------------
  const signUp = async (email, password) => {
    try{
        setLoading(true)
        const userCredential= await createUserWithEmailAndPassword(auth, email, password)
            // Signed up 
        const user = userCredential.user;
        console.log("userCredentails  in useAuth signUp ",user)
        setLoading(false)
        return user 
    }
    catch(error) {
        setLoading(false)
        throw new Error(error.message)  
    }
}


  const signIn = async (email, password) => {
    try{
        setLoading(true)
        const userCredential= await signInWithEmailAndPassword(auth, email, password)
            // Signed In
        const user = userCredential.user;
        console.log("userCredentails  in useAuth SignIn Method ",user)
        setLoading(false)
        return user 
    }
    catch(error) {
        setLoading(false)
        throw new Error(error.message)  
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);  // Optionally clear the current user state immediately
    } catch (error) {
        toast.error("Error logging out: ", error.message);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const Google_Auth = () => {

    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      setUser(user); // Store the user info in the state
    })
    .catch((error) => {
      console.error('Error during Google sign-in:', error);
    });
  }

  return {
    currentUser,
    loading,
    signUp,
    signIn,
    logOut,
    Google_Auth
  };
}

export default useAuth;
