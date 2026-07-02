import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const ContinueButton = ({
	variants,
	canContinue,
	pickUp,
	pickUpLat,
	pickUpLon,
	drop,
	dropLat,
	dropLon,
	mobile,
	vehicle,
}) => {
	const navigate = useNavigate();
	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.1 }}
		>
			<motion.button
				whileTap={{ scale: 0.97 }}
				whileHover={canContinue ? { scale: 1.02 } : {}}
				disabled={!canContinue}
				onClick={() => {
					navigate(
						`/search?pickup=${encodeURIComponent(pickUp)}&drop=${encodeURIComponent(drop)}&vehicle=${encodeURIComponent(vehicle)}&mobile=${encodeURIComponent(mobile)}&pickuplat=${encodeURIComponent(pickUpLat)}&pickuplon=${encodeURIComponent(pickUpLon)}&droplat=${encodeURIComponent(dropLat)}&droplon=${encodeURIComponent(dropLon)}`,
					);
				}}
				className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-950 cursor-pointer disabled:bg-zinc-600 text-white font-black text-sm flex items-center justify-center gap-2.5 transition-colors shadow-lg disabled:shadow-none"
			>
				<span>Conitnue</span>
			</motion.button>
		</motion.div>
	);
};

export default ContinueButton;
