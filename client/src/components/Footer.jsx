import React from 'react'
import { motion } from "motion/react"
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6'

const Footer = () => {
    return (
        <div className='w-full bg-background text-white'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className='max-w-7xl mx-auto px-6 pt-16'
            >
                <div className='flex justify-between gap-12'>
                    <div>
                        <img src="logo.png" alt="Logo" className='w-24' />
                        <p className='mt-4 text-gray-400 text-xs leading-relaxed'>Book any vihicle - from bike to trucks. Trusted owner. Transparent pricing.</p>
                    </div>
                    <div className='flex gap-4 my-6'>
                        {[FaInstagram, FaFacebook, FaTwitter, FaLinkedin].map((Icon, index) => (
                            <motion.a
                                key={index}
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.1, ease: "linear" }}
                                href='#'
                                className='w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-background transition-colors duration-300'
                            >
                                <Icon />
                            </motion.a>
                        ))}
                    </div>
                </div>
                <div className='border-t border-white/20'>
                    <div className='max-w-7xl mx-auto p-6 flex flex-col sm:flex-row sm:justify-center justify-between items-center text-xs text-gray-500 gap-4'>
                        <p>&copy; {new Date().getFullYear()} MOVEZ. All rights reserved. </p>

                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default Footer