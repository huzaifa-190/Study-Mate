import { React,useState, useEffect } from 'react';
import { getDatabase, ref, set, push, get ,onValue,remove} from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import app from '../DataBase/FirebaseConfig';
import useAuth from './useAuth';
const db = getDatabase(app);


export default function useFireStore () {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const {currentUser} = useAuth();
  const [fetchingData, setFetchingData] = useState(false);
  const [writingData, setWritingData] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [error, setError] = useState(null);
  
  // ---------------------------------------------------------------- WRITE TAGS METHOD ----------------------------------------------------------------
  const writeTags = async (tag) => {
    try {
      setWritingData(true);
      const newDocRef = ref(db, `Tasks/${currentUser?.uid}/tags/`);
      const newTaskRef = push(newDocRef); // Generates a unique key for the new task
      await set(newTaskRef, tag);
      setWritingData(false);
    } catch (error) {
      setError(error);
      toast.error(`Failed! ${error.message}`);
      setWritingData(false);
    }
  };
  // ---------------------------------------------------------------- UPDATE TAGS METHOD ----------------------------------------------------------------
  const updateTags  = async (id,docName,tag) => {
    try {
      setWritingData(true);
      const newDocRef =(ref(db,docName+'/'+currentUser.uid+'/tags/'+id));
      await set(newDocRef, tag);
    } catch (error) {
      setError(error);
      toast.error(`Failed!--> ${error.message}`);
    }
    finally {
      setWritingData(false);
    }
  };


  // ---------------------------------------------------------------- WRITE DOC METHOD ----------------------------------------------------------------
  const writeData = async (task) => {
    try {
      setWritingData(true);
      const newDocRef = ref(db, `Tasks/${currentUser?.uid}/tasks`);
      const newTaskRef = push(newDocRef); // Generates a unique key for the new task
      await set(newTaskRef, task);
      setWritingData(false);
    } catch (error) {
      setError(error);
      toast.error(`Failed! ${error.message}`);
      setWritingData(false);
    }
  };
  
  // ---------------------------------------------------------------- DELETE DOC METHOD ----------------------------------------------------------------
  const deleteDoc = async (id,docName)=>{
    try {
      setWritingData(true);
      const docRef =(ref(db,docName+'/'+currentUser.uid+'/tasks/'+id));
      await remove(docRef)
      toast.success("Task deleted Successfully",{autoClose:1000});
      setWritingData(false);
    } catch (error) {
      setError(error);
      toast.error(`Failed! ${error.message}`);
      setWritingData(false);
    }
  }
  // ---------------------------------------------------------------- UPDATE DOC METHOD ----------------------------------------------------------------
  const upDateDoc  = async (id,docName,task) => {
    try {
      setWritingData(true);
      const newDocRef =(ref(db,docName+'/'+currentUser.uid+'/tasks/'+id));
      await set(newDocRef, task);
    } catch (error) {
      setError(error);
      toast.error(`Failed!--> ${error.message}`);
    }
    finally {
      setWritingData(false);
    }
  };
  
  // ---------------------------------------------------------------- TOGGLE COMPLETED METHOD ---------------------------------------------------------------
  const toggleCompleted  = async (id,docName,task) => {
    try {
      setWritingData(true);
      const newDocRef =(ref(db,docName+'/'+currentUser.uid+'/tasks/'+id));
      await set(newDocRef, task);
    } catch (error) {
      setError(error);
      toast.error(`Failed! ${error.message}`);
    }
    finally{
      setWritingData(false);
    }
  };



  // ---------------------------------------------------------------- FETCH BY ID ----------------------------------------------------------------
  const fetchTask = async (docName,taskId) => {
    if(!navigator.onLine){
      toast("No Internet",{autoClose:1000})
    }else{
      
      try {
        setUpdatingData(true);
        const docRef = ref(db, docName+'/'+taskId);
        // Fetching that single task from db
        const snapshot = await get(docRef)
        if(snapshot.exists()){
          const prevTask = snapshot.val()
          console.log("This is task fetched for update ==> ",prevTask)
        }
       
      } catch (error) {
          setError(error);
          toast.error(`Failed! ${error.message}`);
          setUpdatingData(false);
          setTasks([])
      }
    };
  }

   
  

  useEffect(()=>{
     // Ensure that currentUser is available before making a request
  if (!currentUser || !currentUser.uid) {
    return;
  }
    // ---------------------------------------------------------------- READ Tasks METHOD ----------------------------------------------------------------
    const readData = (docName) => {
      
      try {
        setFetchingData(true);
        // const docRef = ref(db,docName);
        // const docRef = ref(db, docName+'/'+currentUser?.uid+'/');
        const docRef = ref(db,`${docName}/${currentUser.uid}/tasks/`);
        
        console.log("Reference path:", docRef.toString());        
        //  console.log("Inside readData mehtod ");
        onValue(docRef, (snapshot) => {
           if (snapshot.exists()) {
             
             const docs = snapshot.val()
             console.log("TAGS ==> snaphot.vals =>  ",docs);
            const docIds = Object.keys(docs);
            const data = docIds.map(id => {return{...docs[id],id:id}})

            console.log("Tasks data from db in readData inside HOok ==>",data);
            setTasks(data);
            setFetchingData(false);
            // return data;
          } else {
            // setError(new Error("No snapshot exists"));
            // toast.error(`Failed - snapshot does't exist`);
            setFetchingData(false);
            setTasks([])
            // return data
          }}
        )
  
      } catch (error) {
          setError(error);
          // toast.error(`Failed! ${error.message}`);
          setFetchingData(false);
          setTasks([])
      }
    }

        // --------------------------------------------------------------- - READ Tags METHOD ----------------------------------------------------------------

    const readTags = (docName) => {

      try {
        setFetchingData(true);
       
        const docRef = ref(db,`${docName}/${currentUser.uid}/tags/`);
        
        console.log("Reference path:", docRef.toString());        
        //  console.log("Inside readTags mehtod ");
         onValue(docRef, (snapshot) => {
           if (snapshot.exists()) {
             
             const docs = snapshot.val()
             console.log("Tags ==> snaphot.vals =>  ",docs);
             const docIds = Object.keys(docs);
             console.log("Tags ==> docIds =>  ",docIds);
            const data = docIds.map(id => {return{...docs[id],id:id}})

            console.log("Tags data from db in readData inside HOok ==>",data);
            setTags(data);
            setFetchingData(false);
            // return data;
          } else {
            // setError(new Error("No snapshot exists"));
            // toast.error(`Failed - snapshot does't exist`);
            setFetchingData(false);
            setTags([])
            // return data
          }}
        )
  
      } catch (error) {
          setError(error);
          toast.error(`Failed! ${error.message}`);
          setFetchingData(false);
          setTasks([])
      }
    }
    
      

      if(!navigator.onLine){
        toast("No Internet",{autoClose:1000})
      }
      else{
        readData("Tasks")
        readTags("Tasks")
      }
      
  },[currentUser])
 

    return {
        tasks,
        tags,
        updateTags,
        setTasks,
        fetchingData,
        writingData,
        toggleCompleted,
        error,
        writeTags,
        writeData,
        upDateDoc,
        deleteDoc,
        setTasks: setTasks
        // readData,
    };
}
