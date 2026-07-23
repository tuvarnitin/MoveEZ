import React, { useEffect, useState } from "react";

import { motion } from "motion/react";

import { RiLoader2Line } from "../../assets/icons/index.js";

import { Button } from "../../components/index.js";
import { PendingBookingCard } from "../../components/Partner/index.js";

import { partnerService } from "../../services/partner.service";
import { bookingService } from "../../services/booking.service.js";

import { getSocket } from "../../socket.io/socketIo.js";

const PendingRequest = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchPendingRequests = async () => {
			try {
				setLoading(true);
				const response = await partnerService.fetchPendingBookingRequests();
				if (response.success) {
					setBookings(response.bookings);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchPendingRequests();
	}, []);

	useEffect(() => {
		const socket = getSocket();

		socket.on("new-booking",(data)=>{
			setBookings(prev => [data,...prev])
		})

		socket.on("cancel-ride",(data)=>{
			setBookings(prev => prev.filter(b => b._id !== data.bookingId))
		})
		
		return ()=> {
			socket.off("new-booking");
			socket.off("cancel-ride");
		}
	}, []);

	return (
		<div className="min-h-screen bg-white pt-20">
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-6xl mx-auto px-6 py-16">
					<h1 className="text-4xl font-semibold text-gray-900">
						Ride Requests
					</h1>
					<p className="mt-3 text-gray-500 text-lg">
						Manage incoming ride requests and respond in real time.
					</p>
				</div>
			</div>
			<div className="max-w-6xl mx-auto px-6 py-12">
				{loading ? (
					<div className="flex justify-center py-20">
						<RiLoader2Line className="animate-spin w-8 h-8 text-gray-700" />
					</div>
				) : bookings.length == 0 ? (
					<div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
						<p className="text-gray-500 text-lg">No pending ride requests.</p>
					</div>
				) : (
					<div className="space-y-6">
						{bookings.map((b, i) => (
							<PendingBookingCard
								setBookings={setBookings}
								b={b}
								key={i}
								i={i}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PendingRequest;
