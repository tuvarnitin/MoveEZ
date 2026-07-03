import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CiLocationOn, CiMapPin, FaArrowLeft, FiNavigation } from "../../assets/icons/index.js";
import { Map } from "../../components/Booking/index.js";

const Search = () => {
	const [params] = useSearchParams();
	const [pickUp, setPickUp] = useState(params.get("pickup"));
	const [drop, setDrop] = useState(params.get("drop"));
	const mobile = params.get("mobile");
	const pickUpLat = params.get("pickuplat");
	const pickUpLon = params.get("pickuplon");
	const dropLat = params.get("droplat");
	const dropLon = params.get("droplon");
	const [km, setKm] = useState(0);

	return (
		<div className="h-full w-full bg-zinc-100 text-background overflow-x-hidden">
			<div className="relative w-full z-50 py-2">
				<motion.div
					onClick={() => window.history.back()}
					whileTap={{ scale: 0.88 }}
					className="absolute top-5 left-5 w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors cursor-pointer"
				>
					<FaArrowLeft />
				</motion.div>
			</div>
			<div className="relative w-full h-[52vh] z-0 overflow-x-hidden">
				<Map
					pickUpLat={pickUpLat}
					pickUpLon={pickUpLon}
					dropLon={dropLon}
					dropLat={dropLat}
					drop={drop}
					pickUp={pickUp}
					km={km}
					setKm={setKm}
					onChange={(p, d) => {
						setDrop(d);
						setPickUp(p);
					}}
					onDistance={setKm}
				/>
			</div>
			<motion.div
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: "spring", stiffness: 160, damping: 22 }}
				className="relative z-20 -mt-10 bg-white border-t border-zinc-200 shadow-[0px_-8px_40px_rgba(0,0,0,0.08)] pt-5 pb-20 min-h-[50vh]"
			>
				<div className="px-5 lg:px-8 max-w-6xl mx-auto">
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
								<p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">Pickup</p>
								<p className="text-sm text-background font-semibold leading-snug truncate">{pickUp || "-"}</p>
							</div>
							<CiLocationOn size={18} className="text-zinc-600" />
						</div>
						<div className="h-px w-[96%] mx-auto bg-zinc-300" />
						<div className="flex gap-3 items-center px-6 py-4 border-b border-zinc-100">
							<div className="flex flex-col items-center pt-1.5 shrink-0">
								<div className="w-2.5 h-2.5 rounded-2xl bg-background" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">Drop</p>
								<p className="text-sm text-background font-semibold leading-snug truncate">{drop || "-"}</p>
							</div>
							<FiNavigation size={18} className="text-zinc-600" />
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
};

export default Search;
