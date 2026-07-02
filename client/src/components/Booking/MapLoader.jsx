import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { CiLocationOn } from "../../assets/icons/index.js";

const MapLoader = () => {
	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 1 }}
				transition={{ duration: 0.55, delay: 2 }}
				exit={{ opacity: [1, 0.5, 0] }}
				className="absolute inset-0 w-full h-full z-100 bg-white text-background backdrop-blur-md flex flex-col items-center justify-center gap-4"
			>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div className="relative h-20">
						<div className="absolute top-1/2 left-1/2 transform -translate-1/2 w-14 h-14 z-10 rounded-full border-2 border-background border-t-transparent animate-spin duration-300 "></div>
						<CiLocationOn
							className="text-background absolute top-1/2 left-1/2 transform -translate-1/2 animate-bounce duration-100"
							size={23}
						/>
					</div>
					<div className="text-center">
						<p>LOADING MAP</p>
						<p className="text-xs text-zinc-400">
							Finding the shortest path...
						</p>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default MapLoader;
