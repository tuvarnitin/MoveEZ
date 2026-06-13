import React from 'react'

import { motion } from "motion/react"
import { IoSparklesOutline } from 'react-icons/io5';

const VehicleCard = ({ vehicle: { id, Icon, badge, description }, hoveredCard, setHoveredCard, index }) => {

    const isHover = hoveredCard == index

    const card = {
        hidden: {
            y: 10,
            opacity: 0,
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <motion.div
            key={id}
            variants={card}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{
                y: -10,
                transition: {
                    duration: 0.15,
                },
            }}
            className='group relative min-w-55 sm:min-w-65 shrink-0 cursor-pointer'
        >
            <motion.div
                variants={card}
                animate={{
                    backgroundColor: isHover ? "#09090B" : "#ffffff",
                    borderColor: isHover ? "#09090B" : "#e4e4e6",
                    boxShadow: isHover ?
                        "0 24px 56px rgba(0,0,0,0.2)"
                        :
                        "0 2px 16px rgba(0,0,0,0.06)"
                }}
                transition={{ duration: 0.25 }}
                className='relative rounded-2xl p-6 sm:p-7 h-full'
            >
                <motion.div
                    animate={{
                        backgroundColor: isHover ? "rgba(255,255,255,0.12)" : "#ffffff",
                        borderColor: isHover ? "rgba(255,255,255,0.15)" : "#e4e4e7",
                        color: isHover ? "#ffffff" : "#71717a"
                    }}
                    className='inline-flex items-center gap-1.5 border text-[max(10px,0.8vw)] font-bold uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-full mb-5 transition-colors'
                >
                    <IoSparklesOutline />
                    {
                        badge
                    }
                </motion.div>
                <motion.div
                    animate={{
                        backgroundColor: isHover ? "rgba(255,255,255,0.1)" : "#f4f4f5",
                        borderColor: isHover ? "rgba(255,255,255,0.15)" : "#e4e4e7"
                    }}
                    transition={{ duration: 0.2 }}
                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center mb-5 transition-colors'
                >
                    <motion.div
                        animate={{
                            color: isHover ? "#ffffff" : "#3f3f46"
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {<Icon />}
                    </motion.div>

                </motion.div>
                <motion.h3
                    animate={{
                        color: isHover ? "#ffffff" : "#09090b"
                    }}
                    transition={{ duration: 0.2 }}
                    className='text-[max(16px,1.1vw)] font-black tracking-tight leading-none mb-2'
                >
                    {name}
                </motion.h3>
                <motion.p
                    animate={{ color: isHover ? "rgba(255,255,255,0.8)" : "#a1a1aa" }}
                    transition={{ duration: 0.2 }}
                    className='text-[max(12px,0.95vw)] font-medium leading-relaxed'
                >
                    {description}
                </motion.p>
            </motion.div>
        </motion.div>
    )
}

export default VehicleCard