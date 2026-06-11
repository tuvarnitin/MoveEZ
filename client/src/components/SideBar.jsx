import React from 'react'

import { AnimatePresence, motion } from "motion/react"

import { GiCarDoor } from "react-icons/gi";
import { IoMdClose } from 'react-icons/io'

import { useDispatch, useSelector } from 'react-redux'
import { onLogout, openAuthModal } from '../redux/features/authSlice';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const SideBar = ({ setIsSidebarOpen }) => {

    const user = useSelector(state => state.auth.user)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()

    const navigate = useNavigate()

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

    const handleLogout = async () => {
        const response = await authService.logout()
        if(response.success){
            dispatch(onLogout())
        }
    }



    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: .4 }}
            className='h-screen fixed top-0 right-0 w-full max-w-90 bg-background border-l-[0.5px] border-white/10 sm:hidden flex flex-col justify-between z-10'>
            <IoMdClose onClick={() => setIsSidebarOpen(prev => !prev)} className='fixed top-2 right-2 cursor-pointer z-20' size={26} />
            <div>
                {
                    user &&
                    <div className="flex items-center gap-2 px-4 py-4 bg-zinc-900 border-b border-zinc-800">
                        <img className='w-9 h-9 rounded-full border-2 border-white ' src={user.avatar} alt="Avatar" />
                        <div className=''>
                            <h1 className='leading-4 text-[max(14px)]'>Name</h1>
                            <p className='leading-4 text-[max(12px)] text-zinc-400'>nitintuvar2003@gmail.com</p>
                        </div>
                    </div>
                }
                <div className={`flex flex-col ${isAuthenticated ? "pt-0" : "pt-4"}`}>
                    <AnimatePresence>
                        {
                            NAV_LINKS.map(({ title, to }, index) => (
                                <motion.div
                                    key={index}>
                                    <motion.div
                                        initial={{ x: 40 * index, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 40, opacity: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className={`relative border-b border-zinc-800 py-3 px-4 cursor-pointer overflow-hidden hover:bg-zinc-950`}>
                                        {title}
                                    </motion.div>
                                </motion.div>
                            ))
                        }
                    </AnimatePresence>
                </div>
            </div>
            <div className='bg-zinc-900 py-2 px-4'>
                {
                    isAuthenticated ?
                        <button className='flex gap-2  text-red-500 items-center cursor-pointer text-md' onClick={handleLogout}>Logout <GiCarDoor /></button>
                        :
                        <button 
                        className='flex gap-2 items-center cursor-pointer text-md' 
                        onClick={()=>{
                            setIsSidebarOpen(false)
                            dispatch(openAuthModal())
                        }}
                        >Login / Sign Up</button>

                }
            </div>
        </motion.div>
    )
}

export default SideBar