import React from 'react'

import { AnimatePresence, motion } from "motion/react"

const PricingModal = ({ data, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 px-4'
            >
                <motion.div
                    initial={{ scale: 0.85 }}
                    animate={{ scale: 1 }}
                    className='w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden'
                >
                    <div className='p-6 border-b'>
                        <h2 className='text-xl font-bold'>Pricing and Vehicle Image</h2>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default PricingModal