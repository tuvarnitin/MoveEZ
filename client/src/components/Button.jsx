import React from 'react'

import { RiLoader2Line } from 'react-icons/ri'

const Button = ({ text, onClick = () => { }, icon = "", fill = false, isLoading, className }) => {
  return (
    <button
      className={`${className} w-full p-1.5 text-[max(18px,1.1vw)] font-extrabold sm:font-semibold ${fill ? "text-white bg-background" : "text-background bg-white border border-background/30"} disabled:opacity-80 rounded-md cursor-pointer hover:bg-background hover:text-white transition-all duration-200 ease-in-out hover:scale-98 w-full flex justify-center items-center gap-2`}
      onClick={onClick}
      disabled={isLoading}
    >{
        isLoading ?
          <RiLoader2Line className='w-10 animate-spin' size={24} />
          :
          <>
            {icon} <span>{text}</span>
          </>
      }</button>
  )
}

export default Button