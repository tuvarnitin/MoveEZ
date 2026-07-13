import React, { lazy, Suspense, useEffect, useState } from "react";
import { partnerService } from "../../services/partner.service";
import useUpdateGeoLoc from "../../hooks/useUpdateGeoLoc";
import LiveRideMap from "./LiveRideMap";
import { motion } from "motion/react";
import { STATUS_LABEL } from "../../constant/index";
import { FiZap } from "react-icons/fi";
import DriverPanel from "./DriverPanel";

const ActiveRide = () => {
	const [booking, setBooking] = useState({});
	const [bookingStatus, setBookingStatus] = useState({});
	const [loading, setLoading] = useState(false);

	const [driverPos, setDriverPos] = useState([]);
	const [pickUpPos, setPickUpPos] = useState([]);
	const [dropPos, setDropPos] = useState([]);

	const [distanceToPickUp, setDistanceToPickUp] = useState(0);
	const [distanceToDrop, setDistanceToDrop] = useState(0);
	const [estTimeToPickup, setEstTimeToPickup] = useState(0);
	const [estTimeToDrop, setEstTimeToDrop] = useState(0);

	const currStatus = STATUS_LABEL[booking.bookingStatus];
    const isActive = ["confirmed","started"].includes(bookingStatus)
    const displayDistance = bookingStatus === "confirmed" ? distanceToPickUp : distanceToDrop
    const displayTime = bookingStatus === "confirmed" ? estTimeToPickup : estTimeToDrop


	useEffect(() => {
		const fetchActiveBooking = async () => {
			setLoading(true);
			try {
				const response = await partnerService.fetchActiveBooking();
				if (response.success) {
					const [pickUpLon, pickUpLat] =
						response.booking.pickUpLocation.coordinates;
					const [dropLon, dropLat] = response.booking.dropLocation.coordinates;
                    setBookingStatus(booking.bookingStatus)
					setBooking(response.booking);
					setPickUpPos([pickUpLat, pickUpLon]);
					setDropPos([dropLat, dropLon]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchActiveBooking();
	}, []);

	useEffect(() => {
		if (!navigator.geolocation) return;
		const watchId = navigator.geolocation.watchPosition(
			(pos) => {
				const lat = pos.coords.latitude;
				const lon = pos.coords.longitude;
				setDriverPos([lat, lon]);
			},
			(error) => {
				console.log(error);
			},
			{
				enableHighAccuracy: true,
				maximumAge: 2000,
				timeout: 10000,
			},
		);
		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, []);

	if (loading || !pickUpPos.length || !driverPos.length || !dropPos.length) {
		return (
			<div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
					<p className="text-white/40 text-sm tracking-widest uppercase font-medium">
						Loading Ride...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen w-full bg-zinc-100 flex flex-col lg:flex-row overflow-hidden">
			<div className="relative flex-1 h-full z-10">
				<LiveRideMap
					driverLocation={driverPos}
					pickUpLocation={pickUpPos}
					dropLocation={dropPos}
					mapStatus={booking.bookingStatus}
					onUpdate={(
						distanceToPickUp,
						distanceToDrop,
						estTimeToPickup,
						estTimeToDrop,
					) => {
						setDistanceToPickUp(distanceToPickUp);
						setDistanceToDrop(distanceToDrop);
						setEstTimeToPickup(estTimeToPickup);
						setEstTimeToDrop(estTimeToDrop);
					}}
				/>
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="absolute top-4 left-1/2 -translate-x-1/2 z-500 pointer-events-none"
				>
					<div
						className={`flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-zinc-100 text-background`}
					>
						<span>{currStatus.label}</span>
					</div>
				</motion.div>
			</div>
			<motion.div
				initial={{ x: 60, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
				className="hidden lg:flex w-105 xl:w-115 bg-white border-l border-zinc-100 flex-col overflow-hidden"
			>
				<div className="bg-zinc-950 px-6 py-5 shrink-0">
					<p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-semibold mb-1">
						Driver Panel
					</p>
					<div className="flex items-center justify-between">
						<h1 className="text-white text-xl font-bold">Active Ride</h1>
						{isActive && (
							<div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
								<FiZap
									size={12}
									className="text-amber-400"
								/>
								<span className="text-white text-xs font-semibold">
									{Math.round(displayTime)} min
								</span>
							</div>
						)}
					</div>
				</div>
                <div className="flex-1 overflow-y-auto scrollbar-hidden">
                    {/* <DriverPanel
                    
                    /> */}
                </div>
			</motion.div>
		</div>
	);
};

export default ActiveRide;
