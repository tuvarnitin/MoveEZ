import React from "react";
import { motion } from "motion/react";
import { FiCheckCircle } from "../../assets/icons/index.js";

const VehicleCard = ({ index, v, active, setVehicle }) => {
	return (
		<motion.div
			key={index}
			initial={{ opacity: 0, y: 12 }}
			initial={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.07 + index * 0.05 }}
			whileTap={{ scale: 0.95 }}
			className={`relative p-3.5 rounded-2xl border flex items-center gap-3 text-left transition-all duration-200 cursor-pointer ${
				active
					? "bg-background border-background shadow-lg"
					: "bg-zinc-50 border-zinc-200 hover:border-zinc-400"
			}`}
			onClick={() => setVehicle(v.id)}
		>
			<div
				className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
					active ? "bg-white" : "bg-zinc-200"
				}`}
			>
				<v.Icon className={`${active ? "text-background" : "text-zinc-600"}`} />
			</div>
			<div className="min-w-0">
				<p
					className={`text-sm font-bold truncate ${active ? "text-white" : "text-background"}`}
				>
					{v.label}
				</p>
				<p
					className={`text-[10px] truncate ${active ? "text-zinc-200" : "text-zinc-400"}`}
				>
					{v.desc}
				</p>
			</div>
			{active && (
				<div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className="absolute top-2 right-2"
				>
					<FiCheckCircle className="text-zinc-200 " />
				</div>
			)}
		</motion.div>
	);
};

export default VehicleCard;
