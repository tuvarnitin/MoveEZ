import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "../../assets/icons/index.js";
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
		</div>
	);
};

export default Search;
