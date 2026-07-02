import React from "react";
import { motion } from "motion/react";

const StatusCard = ({ icon: Icon, title, desc }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 shadow-lg border flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center"
		>
			<div className="bg-background text-white p-3 md:p-4 rounded-xl shrink-0">
				<Icon />
			</div>
			<div className="flex-1">
				<h1 className="text-base sm:text-lg md:text-xl font-semibold">
					{title}
				</h1>
				<p className="text-gray-600 text-sm sm:text-base mt-1">{desc}</p>
			</div>
		</motion.div>
	);
};

export default StatusCard;
