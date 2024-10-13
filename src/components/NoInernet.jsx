import React from 'react'
import { IoCloudOfflineSharp } from "react-icons/io5";

export default function NoInernet() {
  return (
    <div className='flex flex-col w-screen h-[60%] justify-center items-center gap-5'>
        <h1 className="flex gap-5 items-center justify-center text-4xl text-gray-800 font-bold  ">
        <IoCloudOfflineSharp size={32}/>
            You're Offline  
        </h1>
        <button className='btn p-3 bg-gray-600 text-white rounded-lg text-md font-mono hover:shadow-2xl' onClick={()=>location.reload()}>
            Refresh
        </button>
    </div>
  )
} 
