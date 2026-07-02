import React from "react";
import { motion } from "motion/react";
import { FaArrowLeft } from "../../assets/icons/index.js";
import { useNavigate } from "react-router-dom";

const Header = ({ progressSteps }) => {
	const navigate = useNavigate()
	return (
		<div className="flex items-center gap-4 mb-6 px-1">
			<motion.button
				whileTap={{ scale: 0.88 }}
				onClick={() => navigate("/")}
				className="w-11 h-11 rounded-2xl bg-white birder border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-colors shrink-0 cursor-pointer"
			>
				<FaArrowLeft className="text-background" />
			</motion.button>
			<div className="flex-1 min-w-0">
				<h1 className="text-background text-xl font-black tracking-tight">
					Book A Ride
				</h1>
				<p className="text-zinc-400 text-xs mt-0.5">
					Fill in the details below
				</p>
			</div>
			<div className="flex items-center gap-1.5 shrink-0">
				{Array(4)
					.fill()
					.map((dot, index) => (
						<motion.div
							key={index}
							animate={{
								width: index < progressSteps ? 20 : 8,
								background: index < progressSteps ? "rgba(0,255,0,1)" : "#ccc",
							}}
							transition={{ duration: 0.3 }}
							className="h-2 rounded-full"
						/>
					))}
			</div>
		</div>
	);
};

export default Header;
