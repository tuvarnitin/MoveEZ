import React, { useEffect, useState } from "react";

import { motion } from "motion/react";

import { useNavigate } from "react-router-dom";

import {
	CiMapPin,
	CiUser,
	FaCar,
	FaChevronRight,
	FaIndianRupeeSign,
	FaTruck,
	FiNavigation,
	GrBike,
	PiPhone,
	RiLoader2Line,
	CiCalendar,
	FaChevronCircleRight,
} from "../../assets/icons/index.js";

import { bookingService } from "../../services/booking.service.js";
import { getSocket } from "../../socket.io/socketIo.js";
import BookingCard from "../../components/Partner/Bookings/BookingCard.jsx";

const PartnerBookings = () => {
	const navigate = useNavigate();
	const [bookings, setBookings] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState("All");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				setLoading(true);
				const response = await bookingService.fetchAllBookings();
				if (response.success) {
					setBookings(response.bookings);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchBookings();
	}, []);

	const filteredBookings =
		selectedStatus === "All"
			? bookings
			: bookings.filter(
					(b) => b.bookingStatus === selectedStatus?.toLowerCase(),
				);

	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl mx-auto py-6">
						<div className="flex items-center gap-3">
							<div className="bg-blue-100 p-2 rounded-lg">
								<FaCar className="w-5 h-5 text-blue-600" />
							</div>
							<h1 className="text-2xl font-semibold text-gray-900">
								Partner Bookings
							</h1>
							<p className="text-gray-500 text-sm mt-1">
								{bookings.length} {bookings.length === 1 ? "ride" : "rides"}{" "}
								assigned to you
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="max-w-3xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<div className="text-sm text-gray-500">
							Showing {filteredBookings.length} bookings
						</div>
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
						>
							<option value="All">All</option>
							<option value="requested">Requested</option>
							<option value="awaiting_payment">Awaiting Payment</option>
							<option value="confirmed">Confirmed</option>
							<option value="started">Started</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
							<option value="rejected">Rejected</option>
							<option value="expired">Expired</option>
						</select>
					</div>
					{loading ? (
						<div className="flex justify-center py-16">
							<RiLoader2Line className="animate-spin w-8 h-8 text-background" />
						</div>
					) : filteredBookings.length === 0 ? (
						<div className="bg-white rounded-xl shadow-sm p-12 text-center">
							<FaCar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
							<h1 className="text-lg font-medium text-gray-900">
								No bookings yet
							</h1>
							<p className="text-gray-500 text-sm mt-1">
								When customers book rides, they'll appear here
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{filteredBookings.map((b, i) => (
								<BookingCard
									b={b}
									key={b._id}
									i={i}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PartnerBookings;
