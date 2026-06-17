import React from 'react'
import {motion} from "motion/react"
import { CiUser } from 'react-icons/ci'
const Tab = ({active,count,icon : Icon,onClick,children}) => {
  return (
      <motion.div
          onClick={onClick}
          whileTap={{ scale: 0.97 }}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-zinc-800 text-sm font-semibold transition-all duration-200 select-none
          ${active ?
                  "bg-white text-background shadow-lg shadow-zinc-400/20"
                  :
                  "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
              }
          `}>
            <span className={`flex items-center ${active ? "text-background" : "text-white"}`}>
              <Icon />
            </span>
          <span className='hidden sm:inline'> {children}</span>
          <span className={`min-w-5.5 h-5 px-1.5 text-[11px] font-bold rounded-full flex items-center justify-center transition-all ${
            active ?
            "bg-background text-white"
            : count > 0 ?
            "bg-red-500 text-white"
            :
            "bg-gray-600 text-gray-100"

          }`}>{count}</span>
      </motion.div>
  )
}

export default Tab