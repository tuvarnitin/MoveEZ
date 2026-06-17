import React from 'react'
import { motion } from "motion/react"
const KeyPermormanceIndicator = ({ label, value, Icon, variant }) => {

  const CONFIG = {
    totalPartners: {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      cardHover: "hover:shadow-purple-200/60"
    },
    approved: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      cardHover: "hover:shadow-blue-200/60"
    },
    pending: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      cardHover: "hover:shadow-amber-200/60"
    },
    rejected: {
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
      cardHover: "hover:shadow-red-200/60"
    }
  }

  const config = CONFIG[variant]
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-background text-white rounded-2xl p-5 border shadow-xs border-gray-900 cursor-default relative overflow-hidden group ${config.cardHover}`}
    >
      <div className={` inset-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl `} style={{ zIndex: 0 }}>
        <div className='relative z-10 space-y-1'>
          <motion.div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.iconBg} ${config.iconColor}`}
          >
            {<Icon />}
          </motion.div>
          <p className='font-bold text-gray-400 text-xs'>{label}</p>
          <h1 className='font-bold text-lg'>{value}</h1>
        </div>
      </div>
    </motion.div>
  )
}

export default KeyPermormanceIndicator