import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import './TaskLoader.css'
export default function TasksLoader() {
  return (
    <div className='flex w-screen h-[60%] items-center justify-center text-xl'>
        {/* <h1>Fetching your Tasks ...</h1> */}
        {/* <ClipLoader
            //   loading={isLoading}
            //   cssOverride={loaderCss}
              color={'#23df20'}
              size={40}
              aria-label="Adding new task ..."
              data-testid="loader"
              /> */}
        <div className="loading">
          <svg width="64px" height="48px">
              <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
            <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
          </svg>
        </div>
    </div>
  )
}
