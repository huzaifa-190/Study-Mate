import {React,useRef} from "react";
import { X } from "lucide-react";


export default function ConfirmModal({onConfirm,onClose,title='Are you sure to sign out ?'}) {
    
    const bgRef = useRef();
    const closeOnBgTap = (e)=>{
        if(bgRef.current === e.target) onClose()
    }

  return (
    <div className="flex w-screen h-screen justify-center items-center fixed inset-0 bg-black bg-opacity-40 backdrop:blur-md " 
        onClick={closeOnBgTap}
        ref={bgRef}
     >
      <div className="flex flex-col w-[90%]  sm:w-[70%] md:w-[50%] lg:w-[30%] gap-5 items-center justify-center rounded-lg bg-white px-2 sm:px-3 pt-2 pb-5  animate-openModal">
        <button className="btn ml-auto" onClick={onClose}>
            <X color="#d12323" size={28} />
          </button>
        <h1 className="md:text-lg text-slate-800">{title}</h1>
        <div className="flex gap-5">
            <button className="btn modal-btn animate-pulse" onClick={onClose}>No</button>
            <button className="btn modal-btn" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}
