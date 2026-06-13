import React from 'react'

const OrDivider = () => {

    return (
        <div className='w-full relative grid place-items-center'>
            <div className='w-full absolute top-1/2 h-px border-t border-background/30'></div>
            <h1 className='text-background/50 text-md z-10 p-1 bg-white'>or</h1>
        </div>
    )
}

export default OrDivider