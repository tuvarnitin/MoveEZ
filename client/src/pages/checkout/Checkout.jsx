import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { bookingService } from "../../services/booking.service.js";

import {
	CheckoutRight,
	CheckoutLeft,
} from "../../components/checkout/index.js";
import { paymentService } from "../../services/payment.service.js";

const Checkout = () => {
	const [searchParams] = useSearchParams();
	const [pickUp, setPickUp] = useState(searchParams.get("pickup") || "");
	const [drop, setDrop] = useState(searchParams.get("drop") || "");
	const mobile = searchParams.get("mobile");
	const pickUpLat = searchParams.get("pickuplat");
	const pickUpLon = searchParams.get("pickuplon");
	const dropLat = searchParams.get("droplat");
	const dropLon = searchParams.get("droplon");
	const vehicle = searchParams.get("vehicle") || "";
	const vehicleId = searchParams.get("vehicleid") || "";
	const driverId = searchParams.get("driverid") || "";
	const fare = Number(searchParams.get("fare")) || "";
	const [status, setStatus] = useState("idle");
	const [loading, setLoading] = useState(false);
	const [booking, setBooking] = useState({});	

	const handleRequestBooking = useCallback(async () => {
		setLoading(true);
		try {
			const response = await bookingService.requestBooking({
				driverId,
				vehicleId,
				pickUpAddress: pickUp,
				dropAddress: drop,
				pickUpLocation: {
					type: "Point",
					coordinates: [pickUpLon, pickUpLat],
				},
				dropLocation: {
					type: "Point",
					coordinates: [dropLon, dropLat],
				},
				fare: fare.toFixed(0),
				mobileNumber: mobile,
			});
			setBooking(response.booking);
			setStatus("requested");
		} catch (error) {
			console.log(error);
		} finally {
			setStatus(booking.bookingStatus);
			setLoading(false);
		}
	});

	const fetchActiveBooking = async () => {
		try {
			const response = await bookingService.fetchActiveBooking();
			setBooking(response.booking);
			setStatus(response.booking.bookingStatus);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelRequest = useCallback(async () => {
		try {
			const response = await bookingService.cancelBooking({ id: booking._id });
			setStatus("idle");
		} catch (error) {
			console.log(error);
		}
	});

	useEffect(() => {
		fetchActiveBooking();
	}, []);

	return (
		<div className="min-h-screen bg-zinc-100 px-4 py-12">
			<div className="relative max-w-6xl mx-auto z-10 ">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mb-10"
				>
					<div className="flex items-center gap-2 mb-2">
						<div className="h-px w-8 bg-zinc-900" />
						<span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
							Booking
						</span>
					</div>
					<h1 className="text-4xl font-black tracking-tight text-zinc-900">
						Checkout
					</h1>
					<p className="text-zinc-400 text-sm mt-1.5 font-medium">
						Review your ride and confirm
					</p>
				</motion.div>
				<div className="grid md:grid-cols-2 gap-6">
					<CheckoutLeft
						vehicle={vehicle}
						pickUp={pickUp}
						drop={drop}
						fare={fare}
					/>
					<CheckoutRight
					bookingId={booking._id}
						loading={loading}
						status={status}
						setStatus={setStatus}
						handleCancelRequest={handleCancelRequest}
						handleRequestBooking={handleRequestBooking}
					/>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
