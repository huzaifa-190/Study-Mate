import {createContext,useContext} from 'react';

export const ToDoContext = createContext({
    tasks: [],
    tags: [],
    AddTask    : (title)=>{},
    RemoveTask : (id)=>{},
    UpdateTask   : ({id,title})=>{},
    toggleComplete   : ({id})=>{},

})

export const ToDoProvider = ToDoContext.Provider



// Always provide useContext by returning a function
export const useToDoContext =()=>  useContext(ToDoContext)