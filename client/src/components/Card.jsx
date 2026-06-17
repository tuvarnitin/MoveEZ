import React from 'react'
import {motion} from "motion/react"
const Card = ({ title, icon: Icon,children }) => {
  return (
    <motion.div
    style={{
              boxShadow:"2px 2px 6px 9px rgba(255,255,255,0.01), inset -2px 2px 6px 1px rgba(255,255,255,0.08),inset 2px -2px 6px 1px rgba(255,255,255,0.08) "
    }}
    className='bg-background rounded-2xl p-8 shadow-lg mt-4 shadow-zinc-900 space-y-6'
    >
        <div className='flex items-center gap-2  font-semibold'>
            <Icon />
            {title}
        </div>
        {children}
    </motion.div>
  )
}

export default Card