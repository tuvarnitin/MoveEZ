import React, { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import useUpdateGeoLoc from "../../hooks/useUpdateGeoLoc.js";

import { STATUS_LABEL, PAYMENT_BADGE } from "../../constant/index";

import {
	CiMapPin,
	FaArrowRight,
	FaChevronUp,
	RiLoader2Line,
	FiNavigation2,
	FiZap,
	LuKeyRound,
} from "../../assets/icons/index.js";

import { LiveRideMap } from "./index.js";
import { ActiveRidePanel, RideCompleted } from "../../components/index.js";

import { bookingService } from "../../services/booking.service.js";
import { getSocket } from "../../socket.io/socketIo.js";
import { partnerService } from "../../services/partner.service.js";
import { useNavigate } from "react-router-dom";

const PartnerActiveRide = () => {
	const [booking, setBooking] = useState({});
	const [bookingStatus, setBookingStatus] = useState("");
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

	const [otpMode, setOtpMode] = useState(false);
	const [otp, setOtp] = useState("");
	const [loadingOtp, setLoadingOtp] = useState(false);
	const [otpVerified, setOtpVerified] = useState(false);
	const [otpError, setOtpError] = useState("");

	const [dropOtpMode, setDropOtpMode] = useState(false);
	const [dropOtp, setDropOtp] = useState("");
	const [loadingDropOtp, setLoadingDropOtp] = useState(false);
	const [dropOtpError, setDropOtpError] = useState("");

	const statusConfig = STATUS_LABEL[booking.bookingStatus];

	const isActive =
		booking.bookingStatus === "confirmed" ||
		booking.bookingStatus === "started";
	const canChat =
		booking.bookingStatus === "confirmed" ||
		booking.bookingStatus === "started";

	const displayTime =
		booking.bookingStatus === "confirmed" ? estTimeToPickup : estTimeToDrop;

	const navigate = useNavigate();

	const driverPanelProps = {
		isActive,
		displayTime: displayTime?.toFixed(1),
		booking,
		canChat,
		onChatToggle,
		openChat,
		currentRole: "driver",
	};

	function onChatToggle() {
		setOpenChat((prev) => !prev);
	}

	useEffect(() => {
		const fetchActiveBooking = async () => {
			setLoading(true);
			try {
				const response = await partnerService.fetchActiveBooking();
				if (response.success) {
					const [pickUpLon, pickUpLat] =
						response.booking.pickUpLocation.coordinates;
					const [dropLon, dropLat] = response.booking.dropLocation.coordinates;
					setBookingStatus(response.booking.bookingStatus);
					setBooking(response.booking);
					setPickUpPos([pickUpLat, pickUpLon]);
					setDropPos([dropLat, dropLon]);
				} else {
					navigate("/partner/bookings")
				}
			} catch (error) {
				navigate("/partner/bookings");
			} finally {
				setLoading(false);
			}
		};
		fetchActiveBooking();
	}, []);

	useEffect(() => {
		if (!navigator.geolocation) return;
		const socket = getSocket();
		const watchId = navigator.geolocation.watchPosition(
			(pos) => {
				const lat = pos.coords.latitude;
				const lon = pos.coords.longitude;
				setDriverPos([lat, lon]);
				socket.emit("driver-location-update", {
					bookingId: booking._id,
					lat,
					lon,
					status: booking.bookingStatus,
				});
			},
			(error) => {
				console.log(error);
			},
			{
				enableHighAccuracy: true,
				maximumAge: 15000,
				timeout: 30000,
			},
		);
		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, [booking._id]);

	useEffect(() => {
		if (!booking?._id) return;
		const socket = getSocket();

		socket.emit("join-ride", { id: booking?._id?.toString() });

		socket.on("driver-location", ({ lat, lon }) => {
			setDriverPos([lat, lon]);
		});

		return () => {
			socket.off("join-ride");
			socket.off("driver-location");
		};
	}, [booking?._id]);

	const handleSendPickUpOtp = async () => {
		try {
			setLoadingOtp(true);
			const response = await bookingService.sendPickUpOtp({
				bookingId: booking._id,
			});
			setOtpMode(true);
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingOtp(false);
		}
	};

	const handleSendDropOtp = async () => {
		try {
			setLoadingDropOtp(true);
			const response = await bookingService.sendDropOtp({
				bookingId: booking._id,
			});
			setDropOtpMode(true);
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingDropOtp(false);
		}
	};

	const verifyPickUpOtp = async () => {
		if (!otp) {
			setOtpError("Please enter an otp");
			return;
		}
		setOtpError("");
		setLoadingOtp(true);
		try {
			const response = await bookingService.verifyPickUpOtp({
				otp,
				bookingId: booking._id,
			});
			setOtpVerified(true);
			setOtpError("");
			setBookingStatus("started");
			setBooking((prev) =>
				prev ? { ...prev, bookingStatus: "started" } : prev,
			);
			setOtpMode(false);
		} catch (error) {
			setOtpError(error?.message || "Verification failed");
			console.log(error);
		} finally {
			setLoadingOtp(false);
		}
	};

	const verifyDropOtp = async () => {
		if (!dropOtp) {
			setOtpError("Please enter an otp");
			return;
		}
		setDropOtpError("");
		setLoadingDropOtp(true);
		try {
			const response = await bookingService.verifyDropOtp({
				otp: dropOtp,
				bookingId: booking._id,
			});
			setDropOtpMode(false);
			setDropOtpError("");
			setBooking(prev => ({ ...prev, bookingStatus: "completed" }));
			setBookingStatus("completed");
		} catch (error) {
			console.log(error);
			setDropOtpError(error?.message || "Verification failed");
		} finally {
			setLoadingDropOtp(false);
		}
	};

	if (
		loading ||
		!pickUpPos.length ||
		!driverPos.length ||
		!dropPos.length ||
		!booking
	) {
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

	if (bookingStatus === "completed" && booking) {
		return (
			<RideCompleted
				booking={booking}
				role="driver"
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
							{statusConfig?.sublabel}
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
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<ActiveRidePanel {...driverPanelProps} />
				</div>
				<div className="shrink-0 border-t border-zinc-100 bg-white px-5 py-4">
					<AnimatePresence>
						{bookingStatus === "confirmed" && !otpMode && !otpVerified && (
							<motion.button
								key="arrived"
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								onClick={handleSendPickUpOtp}
								disabled={loadingOtp}
								className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[.97] text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
							>
								{loadingOtp ? (
									<RiLoader2Line
										className="w-10 animate-spin"
										size={24}
									/>
								) : (
									<>
										{" "}
										<CiMapPin size={16} /> I've Arrived At Pickup{" "}
										<FaArrowRight
											size={15}
											className="ml-1"
										/>
									</>
								)}
							</motion.button>
						)}
						{bookingStatus === "confirmed" && otpMode && !otpVerified && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.98 }}
								transition={{ duration: 0.3 }}
								className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden"
							>
								<div className="bg-zinc-950 px-4 py-3 flex items-center gap-2">
									<LuKeyRound
										size={14}
										className="text-amber-400"
									/>
									<p className="text-white text-xs font-bold tracking-wide uppercase">
										Enter Customer OTP
									</p>
								</div>

								<div className="p-4 space-y-3">
									<p className="text-xs text-zinc-500">
										Ask the customer for their 4-digit OTP to start the ride.
									</p>
									<div className="flex justify-center">
										<input
											type="text"
											maxLength={4}
											value={otp}
											onChange={(e) => {
												setOtp(e.target.value.replace(/\D/g, ""));
												setOtpError("");
											}}
											placeholder="• • • •"
											className="w-48 border-2 text-background border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-black outline-none transition-colors placeholder:text-center"
										/>
									</div>
									{otpError && (
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="text-red-500 text-xs text-center font-medium"
										>
											{otpError}
										</motion.p>
									)}

									<div className="flex gap-2">
										<button
											onClick={() => {
												setOtpMode(false);
												setOtp("");
												setOtpError("");
											}}
											className="flex-1 border border-zinc-200 bg-white text-zinc-700 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all"
										>
											Cancel
										</button>
										<button
											onClick={verifyPickUpOtp}
											disabled={loadingOtp || otp.length < 4}
											className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all cursor-pointer disabled:cursor-not-allowed"
										>
											{loadingOtp ? (
												<span className="flex items-center justify-center gap-2">
													Verifying...
												</span>
											) : (
												<span>Verify</span>
											)}
										</button>
									</div>
								</div>
							</motion.div>
						)}
						{bookingStatus === "started" && !dropOtpMode && (
							<motion.button
								key="drop"
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								onClick={handleSendDropOtp}
								disabled={loadingDropOtp}
								className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[.97] text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
							>
								{loadingDropOtp ? (
									<RiLoader2Line
										className="w-10 animate-spin"
										size={24}
									/>
								) : (
									<>
										{" "}
										<FiNavigation2 size={16} /> Mark as drop{" "}
										<FaArrowRight
											size={15}
											className="ml-1"
										/>
									</>
								)}
							</motion.button>
						)}
						{bookingStatus === "started" && dropOtpMode && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.98 }}
								transition={{ duration: 0.3 }}
								className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden"
							>
								<div className="bg-zinc-950 px-4 py-3 flex items-center gap-2">
									<LuKeyRound
										size={14}
										className="text-amber-400"
									/>
									<p className="text-white text-xs font-bold tracking-wide uppercase">
										Enter Customer OTP
									</p>
								</div>

								<div className="p-4 space-y-3">
									<p className="text-xs text-zinc-500">
										Ask the customer for their 4-digit OTP to end the ride.
									</p>
									<div className="flex justify-center">
										<input
											type="text"
											maxLength={4}
											value={dropOtp}
											onChange={(e) => {
												setDropOtp(e.target.value.replace(/\D/g, ""));
												setDropOtpError("");
											}}
											placeholder="• • • •"
											className="w-48 border-2 text-background border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-black outline-none transition-colors placeholder:text-center"
										/>
									</div>
									{dropOtpError && (
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="text-red-500 text-xs text-center font-medium"
										>
											{dropOtpError}
										</motion.p>
									)}

									<div className="flex gap-2">
										<button
											onClick={() => {
												setDropOtpMode(false);
												setDropOtp("");
												setDropOtpError("");
											}}
											disabled={loadingDropOtp}
											className="flex-1 border border-zinc-200 bg-white text-zinc-700 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all"
										>
											Cancel
										</button>
										<button
											onClick={verifyDropOtp}
											disabled={loadingDropOtp || dropOtp.length < 4}
											className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all cursor-pointer disabled:cursor-not-allowed"
										>
											{loadingDropOtp ? (
												<span className="flex items-center justify-center gap-2">
													Verifying...
												</span>
											) : (
												<span>Verify</span>
											)}
										</button>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
			<div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
				<motion.div
					className="bg-white rounded-t-3xl shadow-2xl pointer-events-auto overflow-y-scroll flex flex-col"
					animate={{ height: isExpanded ? "82vh" : 142 }}
					transition={{ type: "spring", stiffness: 320, damping: 38 }}
				>
					<div className="shrink-0 select-none">
						<div className="pt-3 pb-1 absolute w-full top-0 z-1 bg-white">
							<div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto" />
						</div>
						<div className="px-5 py-3 pt-6 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span
									className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusConfig.dot}`}
								/>
								<div>
									<p className="text-sm font-bold text-zinc-900 leading-tight">
										{statusConfig.label}
									</p>
									<p className="text-xs text-zinc-400 leading-tight">
										{statusConfig.sublabel}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								{isActive && (
									<div className="text-right">
										<p className="text-2xl font-black text-zinc-900 leading-none">
											{Math.round(displayTime) || 0}
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

					<div className="shrink-0 border-t border-zinc-100 bg-white px-5 py-4">
						<AnimatePresence>
							{bookingStatus === "confirmed" && !otpMode && !otpVerified && (
								<motion.button
									key="arrived"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									onClick={handleSendPickUpOtp}
									className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[.97] text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
								>
									{loadingOtp ? (
										<RiLoader2Line
											className="w-10 animate-spin"
											size={24}
										/>
									) : (
										<>
											{" "}
											<CiMapPin size={16} /> I've Arrived At Pickup{" "}
											<FaArrowRight
												size={15}
												className="ml-1"
											/>
										</>
									)}
								</motion.button>
							)}
							{bookingStatus === "confirmed" && otpMode && !otpVerified && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.98 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: -10, scale: 0.98 }}
									transition={{ duration: 0.3 }}
									className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden"
								>
									<div className="bg-zinc-950 px-4 py-3 flex items-center gap-2">
										<LuKeyRound
											size={14}
											className="text-amber-400"
										/>
										<p className="text-white text-xs font-bold tracking-wide uppercase">
											Enter Customer OTP
										</p>
									</div>

									<div className="p-4 space-y-3">
										<p className="text-xs text-zinc-500">
											Ask the customer for their 4-digit OTP to start the ride.
										</p>
										<div className="flex justify-center">
											<input
												type="text"
												maxLength={4}
												value={otp}
												onChange={(e) => {
													setOtp(e.target.value.replace(/\D/g, ""));
													setOtpError("");
												}}
												placeholder="• • • •"
												className="w-48 border-2 text-background border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-black outline-none transition-colors placeholder:text-center"
											/>
										</div>
										{otpError && (
											<motion.p
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className="text-red-500 text-xs text-center font-medium"
											>
												{otpError}
											</motion.p>
										)}

										<div className="flex gap-2">
											<button
												onClick={() => {
													setOtpMode(false);
													setOtp("");
													setOtpError("");
												}}
												className="flex-1 border border-zinc-200 bg-white text-zinc-700 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all"
											>
												Cancel
											</button>
											<button
												onClick={verifyPickUpOtp}
												disabled={loadingOtp || otp.length < 4}
												className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all"
											>
												{loadingOtp ? (
													<span className="flex items-center justify-center gap-2">
														Verifying...
													</span>
												) : (
													<span>Verify</span>
												)}
											</button>
										</div>
									</div>
								</motion.div>
							)}
							{bookingStatus === "started" && !dropOtpMode && (
								<motion.button
									key="drop"
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									onClick={handleSendDropOtp}
									className="w-full bg-zinc-900 hover:bg-zinc-800 active:scale-[.97] text-white py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
								>
									{loadingDropOtp ? (
										<RiLoader2Line
											className="w-10 animate-spin"
											size={24}
										/>
									) : (
										<>
											{" "}
											<FiNavigation2 size={16} /> Mark as drop{" "}
											<FaArrowRight
												size={15}
												className="ml-1"
											/>
										</>
									)}
								</motion.button>
							)}
							{bookingStatus === "started" && dropOtpMode && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.98 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: -10, scale: 0.98 }}
									transition={{ duration: 0.3 }}
									className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden"
								>
									<div className="bg-zinc-950 px-4 py-3 flex items-center gap-2">
										<LuKeyRound
											size={14}
											className="text-amber-400"
										/>
										<p className="text-white text-xs font-bold tracking-wide uppercase">
											Enter Customer OTP
										</p>
									</div>

									<div className="p-4 space-y-3">
										<p className="text-xs text-zinc-500">
											Ask the customer for their 4-digit OTP to end the ride.
										</p>
										<div className="flex justify-center">
											<input
												type="text"
												maxLength={4}
												value={dropOtp}
												onChange={(e) => {
													setDropOtp(e.target.value.replace(/\D/g, ""));
													setDropOtpError("");
												}}
												placeholder="• • • •"
												className="w-48 border-2 text-background border-zinc-200 focus:border-zinc-900 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-black outline-none transition-colors placeholder:text-center"
											/>
										</div>
										{dropOtpError && (
											<motion.p
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className="text-red-500 text-xs text-center font-medium"
											>
												{dropOtpError}
											</motion.p>
										)}

										<div className="flex gap-2">
											<button
												onClick={() => {
													setDropOtpMode(false);
													setDropOtp("");
													setDropOtpError("");
												}}
												className="flex-1 border border-zinc-200 bg-white text-zinc-700 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all"
											>
												Cancel
											</button>
											<button
												onClick={verifyDropOtp}
												disabled={loadingDropOtp || dropOtp.length < 4}
												className="flex-1 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all"
											>
												{loadingDropOtp ? (
													<span className="flex items-center justify-center gap-2">
														Verifying...
													</span>
												) : (
													<span>Verify</span>
												)}
											</button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default PartnerActiveRide;
