import React, {
	Activity,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AnimatePresence, motion, press } from "motion/react";

import {
	FaArrowLeft,
	FaBus,
	FaCar,
	FaMotorcycle,
	FaTruck,
	MdBikeScooter,
} from "../assets/icons/index.js";

import {
	BankingInfo,
	UploadDocuments,
	Button,
	VehicleDetails,
} from "../components/index.js";

import { useSelector } from "react-redux";

const BecomePartner = () => {
	const navigate = useNavigate();
	const [direction, setDirection] = useState(3);

	const variants = {
		enter: (direction) => ({
			x: direction > 0 ? 20 : -20,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction) => ({
			x: direction > 0 ? -20 : 20,
			opacity: 0,
		}),
	};

	return (
		<div className="w-full h-dvh sm:h-full bg-background flex justify-center sm:p-2">
			<AnimatePresence
				mode="wait"
				custom={direction}
			>
				<motion.div
					custom={direction}
					variants={variants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{
						duration: 0.1,
						ease: "linear",
					}}
					className="w-full max-w-xl sm:mt-10 h-full bg-white sm:rounded-2xl border border-gray-200 shadow-[0_20px_70px_rgba(255,255,255,0.15)] text-background"
				>
					<div className="relative p-6 pt-2 sm:p-8 my-auto">
						<button
							onClick={() => window.history.back()}
							className="absolute left-4 top-4 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-background hover:bg-gray-100 cursor-pointer hover:scale-90 transition z-10"
						>
							<FaArrowLeft className="cursor-pointer" />
						</button>

						<Outlet />
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default BecomePartner;
