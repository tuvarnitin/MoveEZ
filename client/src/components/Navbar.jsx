import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { motion } from "motion/react"

import { useDispatch, useSelector } from 'react-redux'
import { closeAuthModal, openAuthModal } from '../redux/features/authSlice'


const Navbar = () => {

    const NAV_LINKS = [
        {
            title: "Home",
            to: "/"
        },
        {
            title: "Bookings",
            to: "/bookings"
        },
        {
            title: "About Us",
            to: "/about-us"
        },
        {
            title: "Contact",
            to: "/contact"
        },
    ]
    const [currPath, setCurrpath] = useState(window.location.pathname)

    const user = useSelector(state => state.auth.user)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const dispatch = useDispatch()

    return (
        <motion.nav
        initial={{y:-20,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:.4}}
         className="w-full flex justify-between items-center p-4 sm:px-6 md:px-16 lg:px-50"
         >
            <Link to={"/"} className="">
                <img src="/logo.png" alt="MoveEZ Logo" width={80} />
            </Link>
            <div className="hidden sm:flex w-full sm:w-fit  justify-center gap-6 sm:border border-white/20 hover:border-white/50 transition-all duration-200 px-4 py-1 rounded-full">
                {
                    NAV_LINKS.map(({ title, to }) => (
                        <Link
                            key={`${title}-${to}`}
                            className={`${currPath === to ? "text-white" : "text-zinc-400 "} hover:text-white `}
                            to={to}
                            onClick={() => setCurrpath(to)}
                        >
                            {title}
                        </Link>
                    ))
                }
            </div>
            <div className='sm:block hidden'>
                {
                    isAuthenticated ?
                        <div className="hidden sm:flex w-10 h-10 border-2 rounded-full items-center justify-center text-xl overflow-hidden">
                          <img className='w-full h-full' src={user.avatar} alt="Avatar" />
                        </div>
                        :
                        <button
                            onClick={() => dispatch(openAuthModal())}
                            className=' px-4 py-0.5 border-white/50 border rounded-full cursor-pointer font-[avenis-light]'
                        >Login</button>
                }
            </div>
            <div className="flex flex-col gap-1 sm:hidden ">
                <div className="w-6 h-0.5 bg-white" />
                <div className="w-6 h-0.5 bg-white" />
                <div className="w-6 h-0.5 bg-white" />
            </div>
        </motion.nav>
    )
}

export default Navbar