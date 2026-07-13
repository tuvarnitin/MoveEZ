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

	const getStatusColor = (status) => {
		const colors = {
			confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
			completed: "bg-teal-50 text-teal-700 border-teal-200",
			requested: "bg-amber-50 text-amber-700 border-amber-200",
			awaiting_payment: "bg-blue-50 text-blue-700 border-blue-200",
			cancelled: "bg-rose-50 text-rose-700 border-rose-200",
			rejected: "bg-red-50 text-red-700 border-red-200",
			expired: "bg-gray-50 text-gray-700 border-gray-200",
		};

		return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
	};

	const getVehicleIcon = (vehicleType) => {
		switch (vehicleType?.toLowerCase()) {
			case "bike":
				return <GrBike className="w-4 h-4 text-gray-400" />;
			case "auto":
				return <FaCar className="w-4 h-4 text-gray-400" />;
			case "truck":
				return <FaTruck className="w-4 h-4 text-gray-400" />;
			case "loading":
			case "car":
			default:
				return <FaCar className="w-4 h-4 text-gray-400" />;
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date
			.toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			})
			.replace(",", "");
	};

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
							<option value="all">All</option>
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
								<motion.div
									key={b._id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
								>
									<div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
										<div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
											<div className="w-12 h-12 rounded-full overflow-hidden bg-blue-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
												<CiUser className="w-6 h-6 text-blue-600" />
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<h3 className="font-semibold text-gray-900">
														{b.user?.name?.toUpperCase() || "CUSTOMER"}
													</h3>
													<span
														className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(b.bookingStatus)}`}
													>
														{b.bookingStatus || (
															<span className="text-red-500 h-px w-4 bg-red-500 inline-block"></span>
														)}
													</span>
												</div>
												<div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
													<PiPhone className="w-3 h-3" />
													<span>{b.userMobileNumber}</span>
												</div>
											</div>
										</div>
										<div className="px-4 pt-3">
											<div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
												{getVehicleIcon(b.vehicle.type)}
												<div className="text-xs text-gray-600">
													{b.vehicle.vehicleModel} •{" "}
													{b.vehicle.number || "Not assigned"}
												</div>
											</div>
										</div>
										<div className="p-4 space-y-3">
											<div className="flex items-start gap-3">
												<div className="hrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
													<CiMapPin className="w-4 h-4 text-green-600" />
												</div>
												<div className="flex-1">
													<span className="text-xs font-medium text-green-600 uppercase tracking-wider">
														PICK UP
													</span>
													<p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
														{b.pickUpAddress}
													</p>
												</div>
											</div>
										</div>
										<div className="p-4 space-y-3">
											<div className="flex items-start gap-3">
												<div className="hrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
													<FiNavigation className="w-4 h-4 text-red-600" />
												</div>
												<div className="flex-1">
													<span className="text-xs font-medium text-red-600 uppercase tracking-wider">
														DROP
													</span>
													<p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
														{b.dropAddress}
													</p>
												</div>
											</div>
										</div>
										<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<CiCalendar className="w-4 h-4 text-gray-400" />
												<span>{formatDate(b.createdAt)}</span>
											</div>
											<div className="flex items-center gap-1 font-semibold text-gray-900">
												<FaIndianRupeeSign className="w-3 h-3" />
												<span>{b.fare}</span>
											</div>
										</div>
										<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
											<div className="flex items-center gap-2">
												<span className="text-xs text-gray-500">Payment:</span>
												<span
													className={`text-xs px-2 py-1 rounded-full ${b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
												>
													{b.paymentStatus}
												</span>
											</div>
											{b.bookingStatus == "confirmed" && (
												<div className="flex items-center gap-2">
													<button
														onClick={() => navigate("/partner/active-ride")}
														className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
													>
														<span>Details</span>
														<FaChevronRight />
													</button>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PartnerBookings;
