import React from 'react'

import { motion } from "motion/react"

import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { RiLoader2Line, RiUploadCloud2Line } from 'react-icons/ri'

const DocsFileInput = React.memo(({ fields:{ title, subTitle, onChange, name, value}, errors, isLoading}) => {
    return (
        <div>
            <motion.label
                whileHover={{ scale: 1.02 }}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:border-background  transition ${value && "border-green-500 hover:border-green-500"} ${errors[name] && "border-red-500 hover:border-red-500"}`}
            >
                <div>
                    <h1 className='font-bold sm:font-semibold text-start'>{title}</h1>
                    <p className='text-xs text-start text-gray-500'>{subTitle}</p>
                </div>
                {
                    isLoading ?
                        <RiLoader2Line className='animate-spin' size={26} />
                        : (
                            value ?
                                <MdOutlineCheckCircleOutline size={33} className='bg-green-500 text-white rounded-full' />
                                :
                                <div className='w-10 h-10 bg-background rounded-full text-white flex items-center justify-center'>
                                    <RiUploadCloud2Line />
                                </div>
                        )
                }
                <input onChange={onChange} name={name} type="file" accept='image/*,.pdf' hidden maxLength={1} />
            </motion.label>
            {
                errors[name] &&
                <p className='text-xs text-left ml-2 mt-0.5 text-red-500'>{errors[name]}</p>
            }
        </div>
    )
}
)
export default DocsFileInput