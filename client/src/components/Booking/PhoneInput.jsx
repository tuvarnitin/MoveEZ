import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { PiPhone, FiCheckCircle } from "../../assets/icons/index.js";

import { SectionTitle } from "./index.js";

const PhoneInput = ({ variants, mobile, setMobile }) => {
	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.05 }}
		>
			<div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3  focus-within:border-zinc-900 focus-within:bg-white transition-all">
				<div className="w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center shrink-0">
					<PiPhone
						size={18}
						className="text-zinc-800"
					/>
				</div>
				<input
					type="tel"
					value={mobile}
					onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
					placeholder="Enter Mobile Number"
					inputMode="numeric"
					maxLength={10}
					className="flex-1 bg-transparent text-sm font-semibold text-background placeholder:text-zinc-400 outline-none"
				/>
				<AnimatePresence>
					{mobile.length == 10 && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
						>
							<FiCheckCircle
								size={16}
								className="text-green-400 shrink-0"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<p className="text-zinc-400 text-[10px] mt-1.5 ml-1 ">
				Ride update will be sent to this number
			</p>
		</motion.div>
	);
};

export default PhoneInput;
