import React from 'react'
import { MdOutlineMail } from 'react-icons/md'

const Input = ({ type, placeholder, icon, value, onChange, ref}) => {
    return (
        <div className='w-full flex border border-background/30 items-center p-1 px-2 gap-2 rounded-md'>
            {icon}
            <input
                type={type}
                placeholder={placeholder}
                className='text-sm border-none outline-none w-full'
                onChange={onChange}
                ref={ref && ref}
            />
        </div>
    )
}

export default Input