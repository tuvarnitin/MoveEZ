import React, { useEffect } from 'react'
import { RiVerifiedBadgeLine } from 'react-icons/ri'

const BankInfoInput = React.memo(({ label, Icon, inputAttr, id, error, value, placeholder, onChange, maxLength }) => {

    return (
        <div>
            <label htmlFor={id} className='text-sm text-gray-500'>{label}</label>
            <div
                className='flex items-center gap-2 '>
                {
                    Icon && <Icon className="text-gray-500" size={22} />
                }
                <input
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    maxLength={maxLength}
                    className={`w-full border-b pl-1 ${error ? "border-red-500 placeholder:text-red-500  text-red-500" : "border-gray-400 text-background"} py-1 focus:outline-none focus:border-gray-900`} />
            </div>
        </div>
    )
})

export default BankInfoInput