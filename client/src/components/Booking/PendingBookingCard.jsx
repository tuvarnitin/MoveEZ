import React, { useState } from "react";

import { motion } from "motion/react";

import {
	FaClockRotateLeft,
	FaIndianRupeeSign,
	FaMapPin,
	FiNavigation,
} from "../../assets/icons/index.js";

import { partnerService } from "../../services/partner.service";

import { Button } from "../../components/index.js";

const PendingBookingCard = ({ b, i, handleReject, handleAccept }) => {
	const [acceptLoading, setAcceptLoading] = useState(false);
	const [rejectLoading, setRejectLoading] = useState(false);

	const handleAcceptBooking = async (id) => {
		setAcceptLoading(true);
		try {
			const response = await partnerService.acceptBooking({ id });
			console.log(response);
		} catch (error) {
			console.log(error);
		} finally {
			setAcceptLoading(false);
		}
	};

	const handleRejectBooking = async (id) => {
		setRejectLoading(true);
		try {
			const response = await partnerService.rejectBooking({ id });
			console.log(response);
		} catch (error) {
			console.log(error);
		} finally {
			setRejectLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -2 }}
			transition={{ duration: 0.25 }}
			className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm hover:shadow-md transition"
		>
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
				<div className="flex-1 space-y-6">
					<div className="flex gap-4">
						<div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
							<FaMapPin
								size={18}
								className="text-background"
							/>
						</div>
						<div>
							<p className="text-xs uppercase text-gray-400 mb-1">
								Pickup Location
							</p>
							<p className="text-gray-900 font-medium">{b.pickUpAddress}</p>
						</div>
					</div>
					<div className="flex gap-4">
						<div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
							<FiNavigation
								size={18}
								className="text-background"
							/>
						</div>
						<div>
							<p className="text-xs uppercase text-gray-400 mb-1">
								Drop Location
							</p>
							<p className="text-gray-900 font-medium">{b.dropAddress}</p>
						</div>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
						<FaClockRotateLeft
							size={14}
							className="opacity-70"
						/>
						<span className="font-medium">
							{new Date(b.createdAt).toLocaleString("en-IN", {
								day: "2-digit",
								month: "short",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
				</div>
				<div className="flex flex-col justify-between lg:items-end gap-6 w-full lg:w-auto">
					<div className="text-left lg:text-right">
						<p className="text-xs tracking-wide text-gray-400 uppercase mb-1">
							Estimated Fare
						</p>
						<div className="flex items-center gap-2 text-3xl font-bold text-gray-900 lg:justify-end">
							<FaIndianRupeeSign size={20} />
							{b.fare}
						</div>
					</div>
					<div className="flex gap-4 w-full lg:w-auto">
						<Button
							text={"Reject"}
							onClick={() => handleRejectBooking(b._id)}
							isLoading={rejectLoading}
						/>
						<Button
							text={"Accept Ride"}
							onClick={() => handleAcceptBooking(b._id)}
							isLoading={acceptLoading}
							fill={true}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default PendingBookingCard;
