import React from "react";

import { motion } from "motion/react";

import { CiLocationOn, FiNavigation } from "../../assets/icons/index.js";

const BothLocationPanel = ({ pickUp, drop }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.12 }}
			className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-5 "
		>
			<div className="flex gap-3 items-center px-6 py-4 border-b border-zinc-100">
				<div className="flex flex-col items-center pt-1.5 shrink-0">
					<div className="w-2.5 h-2.5 rounded-2xl bg-background" />
					<div className="w-px flex-1 bg-zinc-300 my-1 min-h-3.5" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">
						Pickup
					</p>
					<p className="text-sm text-background font-semibold leading-snug truncate">
						{pickUp || "-"}
					</p>
				</div>
				<CiLocationOn
					size={18}
					className="text-zinc-600"
				/>
			</div>
			<div className="h-px w-[96%] mx-auto bg-zinc-300" />
			<div className="flex gap-3 items-center px-6 py-4 border-b border-zinc-100">
				<div className="flex flex-col items-center pt-1.5 shrink-0">
					<div className="w-2.5 h-2.5 rounded-2xl bg-background" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">
						Drop
					</p>
					<p className="text-sm text-background font-semibold leading-snug truncate">
						{drop || "-"}
					</p>
				</div>
				<FiNavigation
					size={18}
					className="text-zinc-600"
				/>
			</div>
		</motion.div>
	);
};

export default BothLocationPanel;
