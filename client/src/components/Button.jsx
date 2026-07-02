import React from 'react'

import { RiLoader2Line } from '../assets/icons/index.js'

const Button = ({ text, onClick = () => { }, icon = "", fill = false, isLoading, className ,style}) => {
  return (
    <button
      className={`w-full p-1.5 px-6 text-[max(18px,1.1vw)] font-extrabold sm:font-semibold ${fill ? "text-white bg-background" : "text-background bg-white border border-background/30"} disabled:bg-zinc-800 rounded-md cursor-pointer hover:bg-background hover:text-white hover:border-white/20 transition-all duration-200 ease-in-out hover:scale-98 w-full flex justify-center items-center text-nowrap gap-2 ${className}`}
      style={style}
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