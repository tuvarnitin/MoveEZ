import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import {
	FaMotorcycle,
	FaTruck,
	FaCarSide,
	FaBusSimple,
} from "../../assets/icons/index.js";

import { Navbar } from "../../components/index.js";

import { authService } from "../../services/auth.service.js";

import { useDispatch, useSelector } from "react-redux";
import { onLogout, openAuthModal } from "../../redux/features/authSlice";

const Hero = ({ setIsAuthModalOpen, isLogin }) => {
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

	const navigate = useNavigate();

	const VEHICLE_LIST = [
		{
			name: "Bike",
			icon: (
				<FaMotorcycle className="text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]" />
			),
		},
		{
			name: "Car",
			icon: (
				<FaCarSide className="text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]" />
			),
		},
		{
			name: "Bus",
			icon: (
				<FaBusSimple className="text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]" />
			),
		},
		{
			name: "Truck",
			icon: (
				<FaTruck className="text-[max(20px,4vw)] md:text-[max(28px,3vw)] lg:text-[max(26px,1.8vw)]" />
			),
		},
	];

	const handleLogout = async () => {
		const res = await authService.logout();
		dispatch(onLogout({}));
	};

	return (
		<div className="overflow-x-hidden pt-30 sm:pt-20 bg-background text-white">
			<main className="w-full min-h-screen flex flex-col justify-center items-center gap-6">
				<div className="flex flex-col items-center gap-4 transform sm:-translate-y-1/2 -translate-y-full">
					<div className="flex flex-col items-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="w-full flex justify-center items-baseline gap-2 sm:gap-4"
						>
							<h1 className="text-[max(2.5vw,16px)] sm:leading-0 font-[supercharge] select-none pointer-events-none text-nowrap">
								Start Your Journey With
							</h1>
							<img
								src="/logo.png"
								alt=""
								className="w-[max(100px,16vw)] select-none pointer-events-none"
								height={100}
							/>
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="font-[avenis] tracking-wider sm:mt-4 text-[max(1.4vw,14px)]"
						>
							Seamless vehicle booking, anytime, anywhere.
						</motion.h1>
					</div>
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="flex gap-[max(30px,10vw)] sm:gap-14 items-center"
					>
						{VEHICLE_LIST.map(({ name, icon }) => (
							<div
								key={`${name}`}
								className="flex flex-col items-center"
							>
								{icon} <h1 className="text-[max(1.4vw,12px)]">{name}</h1>
							</div>
						))}
					</motion.div>
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="px-4 py-2 text-background bg-white rounded-full cursor-pointer hover:bg-white/90 hover:-translate-y-0.5 transition duration-150"
						onClick={() => {
							isAuthenticated
								? navigate("/booking")
								: dispatch(openAuthModal());
						}}
					>
						Book Now
					</motion.button>
				</div>
			</main>
		</div>
	);
};

export default Hero;
