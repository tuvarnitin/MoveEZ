import React from 'react'

import { AnimatePresence, motion } from "motion/react"

import { GiCarDoor, IoMdClose } from "../assets/icons/index.js";

import { useDispatch, useSelector } from 'react-redux'
import { onLogout, openAuthModal } from '../redux/features/authSlice';
import { authService } from '../services/auth.service';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearUserData } from '../redux/features/userSlice';
import { useEffect } from 'react';

const SideBar = ({ setIsSidebarOpen,links }) => {

    const user = useSelector(state => state.user.data)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleLogout = async () => {
        const response = await authService.logout()
        if (response.success) {
            dispatch(onLogout())
            dispatch(clearUserData())
        }
    }

    return (
			<motion.div
				initial={{ x: "100%" }}
				animate={{ x: 0 }}
				exit={{ x: "100%" }}
				transition={{ duration: 0.4 }}
				className="h-screen fixed top-0 right-0 w-full max-w-90 bg-background text-white border-l-[0.5px] border-white/10 sm:hidden flex flex-col justify-between z-30"
			>
				<IoMdClose
					onClick={() => setIsSidebarOpen((prev) => !prev)}
					className="fixed top-2 right-2 cursor-pointer z-20"
					size={26}
				/>
				<div>
					{user && (
						<div className="flex items-center gap-2 px-4 py-4 bg-zinc-900 border-b border-zinc-800">
							<img
								className="w-9 h-9 rounded-full border-2 border-white "
								src={user.avatar}
								alt="Avatar"
							/>
							<div className="">
								<h1 className="leading-4 text-[max(14px)]">{user.name}</h1>
								<p className="leading-4 text-[max(12px)] text-zinc-400">
									{user.email}
								</p>
							</div>
						</div>
					)}
					<div className={`flex flex-col ${isAuthenticated ? "pt-0" : "pt-4"}`}>
						<AnimatePresence mode='sync'>
							{links.map(({ title, to }, index) => (
								<motion.div key={index}>
									<motion.div
										href={to}
										initial={{ x: 40 * index, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: 0, opacity: 0 }}
										transition={{ delay: 0.1 * index }}
										onClick={() => setIsSidebarOpen(false)}
										className={`relative border-b border-zinc-800 cursor-pointer overflow-hidden hover:bg-zinc-950`}
									>
										<NavLink
											className="w-full h-full  py-3 px-4 inline-block"
											to={to}
										>
											{title}
										</NavLink>
									</motion.div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</div>
				<div className="bg-zinc-900 py-2 px-4">
					{isAuthenticated ? (
						<button
							className="flex gap-2  text-red-500 items-center cursor-pointer text-md"
							onClick={handleLogout}
						>
							Logout <GiCarDoor />
						</button>
					) : (
						<button
							className="flex gap-2 items-center cursor-pointer text-md"
							onClick={() => {
								setIsSidebarOpen(false);
								dispatch(openAuthModal());
							}}
						>
							Login / Sign Up
						</button>
					)}
				</div>
			</motion.div>
		);
}

export default SideBar