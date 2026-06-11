import React from 'react'
import { RiUploadCloud2Line } from 'react-icons/ri'
import { motion } from "motion/react"

const DocsFileInput = ({ title, subTitle, onChange, name, errors }) => {
    return (
        <motion.label
            whileHover={{ scale: 1.02 }}
            className={`
                ${errors[name] ? "border-red-500" : " border-gray-200"}
                flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:border-background  transition`}
        >
            <div>
                <h1 className='font-bold sm:font-semibold text-start'>{title}</h1>
                <p className='text-xs text-start text-gray-500'>{subTitle}</p>
            </div>
            <div className='w-10 h-10 bg-background rounded-full text-white flex items-center justify-center'>
                <RiUploadCloud2Line />
            </div>
            <input onChange={onChange} name={name} type="file" accept='image/*,.pdf' hidden maxLength={1} />
        </motion.label>

    )
}

export default DocsFileInput