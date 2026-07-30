import React from 'react'
import { useEffect } from 'react';
import {motion} from "motion/react"
import { useState } from 'react';
import { CiCalendar, CiMapPin, CiUser } from 'react-icons/ci';
import { FaCar, FaChevronRight, FaIndianRupeeSign, FaTruck } from 'react-icons/fa6';
import { FiNavigation } from 'react-icons/fi';
import { PiPhone } from 'react-icons/pi';
import { GrBike } from 'react-icons/gr';
import { getSocket } from '../../../socket.io/socketIo';
import { useNavigate } from 'react-router-dom';

const BookingCard = ({b,i}) => {
    const [booking,setBooking] = useState(b)
    const navigate = useNavigate()

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
    
	useEffect(() => {
		const socket = getSocket();
		socket.on("payment", (data) => {
            if(!booking) return ;
            setBooking(prev => ({...prev,paymentMethod:data.paymentMethod,paymentStatus:data.paymentStatus,bookingStatus:data.bookingStatus}))
		});

		return () => {
			socket.off("payment");
		};
	}, []);

    if(!booking){
        return
    }
  return (
		<motion.div
			key={booking._id}
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
								{booking.user?.name?.toUpperCase() || "CUSTOMER"}
							</h3>
							<span
								className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}
							>
								{booking.bookingStatus || (
									<span className="text-red-500 h-px w-4 bg-red-500 inline-block"></span>
								)}
							</span>
						</div>
						<div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
							<PiPhone className="w-3 h-3" />
							<span>{booking.userMobileNumber}</span>
						</div>
					</div>
				</div>
				<div className="px-4 pt-3">
					<div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
						{getVehicleIcon(booking.vehicle.type)}
						<div className="text-xs text-gray-600">
							{booking.vehicle.vehicleModel} • {booking.vehicle.number || "Not assigned"}
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
								{booking.pickUpAddress}
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
								{booking.dropAddress}
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<CiCalendar className="w-4 h-4 text-gray-400" />
						<span>{formatDate(booking.createdAt)}</span>
					</div>
					<div className="flex items-center gap-1 font-semibold text-gray-900">
						<FaIndianRupeeSign className="w-3 h-3" />
						<span>{booking.fare}</span>
					</div>
				</div>
				<div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
					<div className="flex items-center gap-2">
						<span className="text-xs text-gray-500">Payment:</span>
						<span
							className={`text-xs px-2 py-1 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
						>
							{booking.paymentStatus}
						</span>
					</div>
					{booking.bookingStatus == "confirmed" && (
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
	);
}

export default BookingCard