import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AnimatePresence, motion } from "motion/react"

import { GiCarWheel } from "react-icons/gi";

import { useDispatch, useSelector } from 'react-redux'
import { closeAuthModal, onLogout, openAuthModal } from '../redux/features/authSlice'
import { FaAngleRight, FaArrowRight, FaBus, FaCar } from 'react-icons/fa6';
import { MdArrowRight } from 'react-icons/md';
import { RiArrowRightLine, RiBikeLine } from 'react-icons/ri';
import { IoLogOut, IoLogOutOutline } from 'react-icons/io5';
import { authService } from '../services/auth.service';


const Navbar = ({ setIsSidebarOpen }) => {

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
    const [showProfileModal, setShowProfileModal] = useState(false)

    const user = useSelector(state => state.auth.user)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            const res = await authService.logout()
            if(res.success){
                dispatch(onLogout())
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: .4 }}
            className="relative w-full flex justify-between items-center p-4 sm:px-6 md:px-16 lg:px-50 z-2"
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
            <div className='flex items-center gap-3'>
                {
                    isAuthenticated ?
                        <div
                            onMouseEnter={() => setShowProfileModal(true)}
                            onClick={() => setShowProfileModal(true)}
                            className="relative flex w-8 h-8 border-2 rounded-full items-center justify-center text-xl overflow-hidden z-10">
                            {
                                user ?
                                    <img className='w-full h-full' src={user?.avatar} alt="Avatar" />
                                    :
                                    <h1>{user?.name.charAt(0).toUpperCase()}</h1>

                            }
                        </div>
                        :
                        <button
                            onClick={() => dispatch(openAuthModal())}
                            className=' px-4 py-0.5 border-white/50 border rounded-full cursor-pointer font-[avenis-light]'
                        >Login</button>
                }
                <GiCarWheel onClick={() => setIsSidebarOpen(true)} size={32} className='flex sm:hidden animate-spin duration-1000 cursor-pointer sm:animate-none' />
            </div>

            <AnimatePresence>
                {
                    showProfileModal && (
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 115, opacity: 1 }}
                            exit={{ y: 60, opacity: 0 }}
                            transition={{ duration: .2 }}
                            onMouseEnter={() => setShowProfileModal(true)}
                            onMouseLeave={() => setShowProfileModal(false)}
                            className='absolute w-full max-w-90 sm:w-80 flex flex-col gap-2 z-1 right-1 sm:right-10 md:right-20 lg:right-54 bg-background border border-zinc-800 rounded-md p-3'>
                            <div className='px-4'>
                                <h1 className='text-md'>{user?.name}</h1>
                                <h6 className='text-[10px] leading-2.5 text-zinc-500 font-semibold'>{user?.role.toUpperCase()}</h6>
                            </div>
                            <button className='w-full flex justify-between items-center px-4 text-[14px] py-3 hover:bg-zinc-800 bg-zinc-900 rounded-lg cursor-pointer'>
                                <div className='flex items-center justify-start'>
                                    <div className='flex relative w-18'>
                                        <div className='flex items-center justify-center bg-white text-background p-1.5 sm:p-2 rounded-full'>
                                            <RiBikeLine />
                                        </div>
                                        <div className='flex transform -translate-x-3 items-center justify-center bg-white text-background p-1.5 sm:p-2 rounded-full'>
                                            <FaCar />
                                        </div>
                                        <div className='flex transform -translate-x-6 items-center justify-center bg-white text-background p-1.5 sm:p-2 rounded-full'>
                                            <FaBus />
                                        </div>
                                    </div>
                                    <p className=' text-[max(14px,1vw)] font-semibold'>Become a partner</p>
                                </div>
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: .25 }}
                                >
                                    <FaAngleRight />
                                </motion.div>
                            </button>
                            <button
                            onClick={handleLogout}
                            className='w-full flex justify-between items-center px-4 text-[14px] py-3 hover:bg-zinc-800 bg-zinc-900 rounded-lg cursor-pointer font-semibold tracking-wide'>Logout <IoLogOutOutline size={20} /></button>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar