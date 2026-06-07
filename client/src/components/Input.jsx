import React from 'react'

import { MdOutlineMail } from 'react-icons/md'

const Input = ({ type, placeholder, icon, value, onChange, ref,errors,name}) => {
    return (
        <div className={`w-full flex border border-background/30 items-center p-1 px-2 gap-2 mt-1 rounded-md ${errors[name] ? "border border-red-500" : ""}`}>
            {icon}
            <input
                type={type}
                placeholder={placeholder}
                className={`text-[max(18px,1.1vw)] outline-none w-full `}
                onChange={onChange}
                ref={ ref}
            />
        </div>
    )
}

export default Input