import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "../assets/icons/index.js";
import { Map } from "../components/index.js";

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
		<div className="min-h-screen bg-zinc-100 text-background overflow-x-hidden ">
			<div className="absolute top-5 left-5 z-50">
				<motion.div
					onClick={() => window.history.back()}
					whileTap={{ scale: 0.88 }}
					className="w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors cursor-pointer"
				>
					<FaArrowLeft />
				</motion.div>
				<div className="relative w-full h-[52vh] z-0">
					<Map
						drop={drop}
						pickUp={pickUp}
						onChange={(p, d) => {
							setDrop(d);
							setPickUp(p);
						}}
						onDistance={setKm}
					/>
				</div>
			</div>
		</div>
	);
};

export default Search;
