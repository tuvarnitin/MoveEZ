import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import useNearbyVehicles from "../../hooks/useNearbyVehicles.js";

import {
	CiLocationOn,
	CiMapPin,
	FaArrowLeft,
	FaCar,
	FaTruck,
	FiNavigation,
	GrBike,
	FiZap,
	LuIndianRupee,
	MdArrowRight,
	CiLock,
	CiSearch,
	FaGauge,
	FaStar,
	GrRefresh,
} from "../../assets/icons/index.js";

import { Map } from "../../components/Booking/index.js";
import { vehicleService } from "../../services/vehicle.service.js";
import BothLocationPanel from "../../components/Booking/BothLocationPanel.jsx";
import VehiclePanel from "../../components/Booking/VehiclePanel.jsx";

const VEHICLES_METAS = {
	bike: {
		label: "Bike",
		Icon: GrBike,
	},
	auto: {
		label: "Auto",
		Icon: FaCar,
	},
	car: {
		label: "Car",
		Icon: FaCar,
	},
	loading: {
		label: "Loading",
		Icon: FaTruck,
	},
	truck: {
		label: "Truck",
		Icon: FaTruck,
	},
};

const Search = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [pickUp, setPickUp] = useState(params.get("pickup"));
	const [pickUpLat, setPickUpLat] = useState(params.get("pickuplat"));
	const [pickUpLon, setPickUpLon] = useState(params.get("pickuplon"));
	const [dropLat, setDropLat] = useState(params.get("droplat"));
	const [dropLon, setDropLon] = useState(params.get("droplon"));
	const [drop, setDrop] = useState(params.get("drop"));
	const [km, setKm] = useState(0);
	const [refresh, setRefresh] = useState(false);
	const mobile = params.get("mobile");
	const vehicleType = params.get("vehicle");

	const meta = VEHICLES_METAS[vehicleType] || "";

	const hadleBooking = (v) => {
		const searchParams = new URLSearchParams({
			pickup:pickUp,
			drop,
			vehicle: v.type,
			vehicleid: v._id,
			driverid: v.owner,
			fare: v.baseFare + v.pricePerKM * km,
			pickuplat : pickUpLat,
			pickuplon : pickUpLon,
			droplat : dropLat,
			droplon : dropLon,
			mobile,
		});
		navigate(`/checkout?${searchParams.toString()}`);
	};


		const { vehicles, loading, error, getNearbyVehicles } = useNearbyVehicles();

		useEffect(() => {
			getNearbyVehicles(pickUpLat, pickUpLon, vehicleType);
		}, [pickUpLat, pickUpLon, vehicleType, getNearbyVehicles,refresh]);

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
					pickUp={pickUp}
					pickUpLat={pickUpLat}
					pickUpLon={pickUpLon}
					setPickUpLat={setPickUpLat}
					setPickUpLon={setPickUpLon}
					drop={drop}
					dropLon={dropLon}
					dropLat={dropLat}
					setDropLat={setDropLat}
					setDropLon={setDropLon}
					vehicleType={vehicleType}
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
				<div className="px-5 lg:px-8 max-w-7xl mx-auto">
					<BothLocationPanel
						pickUp={pickUp}
						drop={drop}
					/>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="flex items-center justify-between mb-4"
					>
						<div>
							<h2 className="text-background text-lg font-semibold tracking-tight">
								{loading
									? "Loading.."
									: vehicles?.length
										? `Available`
										: "No Nearby Vehicles"}
							</h2>
							{meta && (
								<div className="text-zinc-400 text-sm mt-0.5">
									{meta.label} rides near your pickup
								</div>
							)}
						</div>
						<AnimatePresence mode="wait">
							{vehicles && loading ? (
								<motion.div
									key="searching"
									initial={{ opacity: 0, scale: 0.85 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.85 }}
									className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full"
								>
									<div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin" />
									<span className="text-zinc-500 text-xs font-semibold">
										Searching...
									</span>
								</motion.div>
							) : vehicles.length > 0 ? (
								<motion.div
									key="live"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full"
								>
									{vehicles.length}
									<FiZap className="text-emerald-600 fill-emerald-600" />
									<span className="text-emerald-600 text-xs font-bold">
										Live
									</span>
								</motion.div>
							) : null}
						</AnimatePresence>
					</motion.div>
					<AnimatePresence>
						{vehicles && !loading && vehicles.length === 0 && (
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center py-14 text-center"
							>
								<div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
									<CiSearch className="text-indigo-400" />
								</div>
								<p className="text-zinc-900 font-bold text-base mb-1">
									Vehicle Not Found
								</p>
								<p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
									{meta.label || "Vehicle"} drivers are available near your
									pickup right now.
								</p>
								<motion.div
									whileTap={{ scale: 0.95 }}
									onClick={() => setRefresh((prev) => !prev)}
									className="mt-5 flex items-center gap-2 bg-background text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
								>
									<GrRefresh /> Refresh
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
					<VehiclePanel
						VEHICLES_METAS={VEHICLES_METAS}
						km={km}
						pickUpLat={pickUpLat}
						pickUpLon={pickUpLon}
						vehicleType={vehicleType}
						vehicles={vehicles}
						onBook={hadleBooking}
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default Search;
