import React from 'react'
import { RiVerifiedBadgeLine } from 'react-icons/ri'

const BankInfoInput = ({ label, Icon, inputId, placeholder, ref, errors }) => {
    return (
        <div>
            <label htmlFor={inputId} className='text-sm text-gray-500'>{label}</label>
            <div
                className='flex items-center gap-2 '>
                {
                    Icon && <Icon className="text-gray-500" size={22} />
                }
                <input
                    ref={ref}
                    type="text"
                    id={inputId}
                    placeholder={placeholder}
                    className={`w-full border-b pl-1 ${errors[inputId] ? "border-red-500 placeholder:text-red-500" : "border-gray-400"} py-1 focus:outline-none focus:border-gray-900`} />
            </div>
        </div>
    )
}

export default BankInfoInput