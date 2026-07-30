import React, { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";

import { PAYMENT_BADGE, STATUS_LABEL } from "../constant/index.js";

import useUpdateGeoLoc from "../hooks/useUpdateGeoLoc.js";

import { FaChevronUp } from "../assets/icons/index.js";

import { LiveRideMap } from "./Partner/index.js";

import { RideCompleted, ActiveRidePanel } from "../components/index.js";

import { FiZap } from "../assets/icons/index.js";

import { getSocket } from "../socket.io/socketIo.js";
import { userService } from "../services/user.service.js";
import { partnerService } from "../services/partner.service.js";

const UserActiveRide = () => {
	const { id } = useParams();

	const [booking, setBooking] = useState({});
	const [loading, setLoading] = useState(false);

	const [driverPos, setDriverPos] = useState([]);
	const [pickUpPos, setPickUpPos] = useState([]);
	const [dropPos, setDropPos] = useState([]);

	const [distanceToPickUp, setDistanceToPickUp] = useState(0);
	const [distanceToDrop, setDistanceToDrop] = useState(0);
	const [estTimeToPickup, setEstTimeToPickup] = useState(0);
	const [estTimeToDrop, setEstTimeToDrop] = useState(0);

	const [isExpanded, setIsExpanded] = useState(false);
	const [openChat, setOpenChat] = useState(false);

	const statusConfig = STATUS_LABEL[booking.bookingStatus];

	const isActive = booking.bookingStatus === "confirmed" || "started";
	const canChat = booking.bookingStatus === "confirmed" || "started";

	const displayTime =
		booking.bookingStatus === "confirmed" ? estTimeToPickup : estTimeToDrop;

	const driverPanelProps = {
		isActive,
		displayTime: displayTime.toFixed(1),
		booking,
		canChat,
		onChatToggle,
		openChat,
		currentRole: "user",
	};

	function onChatToggle() {
		setOpenChat((prev) => !prev);
	}

	useEffect(() => {
		const fetchActiveBooking = async () => {
			setLoading(true);
			try {
				const response = await userService.fetchAciveBookings({
					bookingId: id,
				});
				if (response.success) {
					const [pickUpLon, pickUpLat] =
						response.booking.pickUpLocation.coordinates;
					const [dropLon, dropLat] = response.booking.dropLocation.coordinates;
					const [driverLon, driverLat] =
						response.booking.driver.location.coordinates;
					setBooking(response.booking);
					setPickUpPos([pickUpLat, pickUpLon]);
					setDropPos([dropLat, dropLon]);
					setDriverPos([driverLat, driverLon]);
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
		const socket = getSocket();
		socket.emit("join-ride", { id });

		socket.on("driver-location", ({ lat, lon }) => {
			setDriverPos([lat, lon]);
		});

		return () => {
			socket.off("join-ride");
			socket.off("driver-location");
		};
	}, [id]);

	useEffect(() => {
		const socket = getSocket();

		socket.on("ride-started", ({ bookingStatus }) => {
			setBooking((prev) => ({ ...prev, bookingStatus }));
		});

		socket.on("ride-completed", ({ bookingStatus, paymentStatus }) => {
			setBooking((prev) => ({ ...prev, bookingStatus, paymentStatus }));
		});

		return () => {
			socket.off("ride-started");
			socket.off("ride-completed");
		};
	}, []);

	if (loading || !pickUpPos.length || !dropPos.length) {
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

	if (booking?.bookingStatus === "completed" && booking) {
		return (
			<RideCompleted
				booking={booking}
				role="user"
			/>
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
						className={`flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-zinc-100 text-zinc-700`}
					>
						<span className="sm:text-sm text-xs text-nowrap font-semibold">
							{statusConfig?.label}
						</span>
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
						User Panel
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
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<ActiveRidePanel {...driverPanelProps} />
				</div>
			</motion.div>
			<div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
				<motion.div
					className="bg-white rounded-t-3xl shadow-2xl pointer-events-auto overflow-y-scroll flex flex-col"
					animate={{ height: isExpanded ? "82vh" : 142 }}
					transition={{ type: "spring", stiffness: 320, damping: 38 }}
				>
					<div className="shrink-0 select-none">
						<div className="absolute top-0 w-full pt-3 pb-1 bg-white z-1">
							<div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto" />
						</div>
						<div className="px-5 py-3 pt-6 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span
									className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusConfig?.dot}`}
								/>
								<div>
									<p className="text-sm font-bold text-zinc-900 leading-tight">
										{statusConfig?.label}
									</p>
									<p className="text-xs text-zinc-400 leading-tight">
										{statusConfig?.sublabel}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								{isActive && (
									<div className="text-right">
										<p className="text-2xl font-black text-zinc-900 leading-none">
											{Math.round(displayTime)}
										</p>
										<p className="text-[10px] text-zinc-400 uppercase tracking-wider">
											min
										</p>
									</div>
								)}
								<motion.div
									animate={{ rotate: isExpanded ? 180 : 0 }}
									transition={{ duration: 0.28 }}
									onClick={() => setIsExpanded((p) => !p)}
									className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center cursor-pointer"
								>
									<FaChevronUp
										size={16}
										className="text-zinc-600"
									/>
								</motion.div>
							</div>
						</div>
						<div className="h-px bg-zinc-100 mx-5" />
						<div className="flex-1 overflow-y-auto min-h-0">
							<ActiveRidePanel {...driverPanelProps} />
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default UserActiveRide;
