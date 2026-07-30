import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { motion } from "motion/react";

import {
	RejectionCard,
	StatusCard,
	ActionCard,
	PricingModal,
} from "../../components/Partner/index.js";

import { Button } from "../../components/index.js";

import {
	FaArrowLeft,
	FaArrowRight,
	FaCheck,
	FaClock,
	FaClockRotateLeft,
	FaVideo,
	PiLockersBold,
	GiLockedBox,
	CiLock,
} from "../../assets/icons/index.js";

import { partnerService } from "../../services/partner.service";
import { vehicleService } from "../../services/vehicle.service";
import PartnerEarning from "../../components/Partner/PartnerEarning.jsx";

const STEPS = [
	{ id: 1, title: "Vehicle", route: "/partner/become-partner" },
	{
		id: 2,
		title: "Document",
		route: "/partner/become-partner/upload-documents",
	},
	{ id: 3, title: "Bank", route: "/partner/become-partner/bank-details" },
	{ id: 4, title: "Review" },
	{ id: 5, title: "Video KYC" },
	{ id: 6, title: "Pricing" },
	{ id: 7, title: "Final Review" },
	{ id: 8, title: "Live" },
];

const TOTAL_STEPS = STEPS.length;

const PartnerDashboard = () => {
	const navigate = useNavigate();

	const step = useSelector((state) => state.user?.data?.onboardingStep);
	const [activeStep, setActiveStep] = useState(step);
	const [showPricingModal, setShowPricingModal] = useState(false);
	const [pricingData, setPricingData] = useState({});
	const [vehicleData, setVehicleData] = useState("");
	const userData = useSelector((state) => state.user?.data);

	const [requestKycLoading, setRequestKycLoading] = useState(false);

	useEffect(() => {
		if (userData) setActiveStep(userData.onboardingStep + 1);
	}, []);

	useEffect(() => {
		try {
			const fetchVehicle = async () => {
				const response = await vehicleService.fetchVehicle();
				if (response.success) {
					setVehicleData(response.vehicle);
				}
			};
			fetchVehicle();
		} catch (error) {
			console.log(error);
		}
	}, []);

	const goToStep = (id, route) => {
		if (
			id == 6 &&
			userData.partnerStatus === "approved" &&
			userData.videoKycStatus === "approved"
		) {
			setShowPricingModal(true);
		}
		if (id <= activeStep && route) {
			navigate(route);
		}
	};

	const handleRequestKyc = async () => {
		try {
			setRequestKycLoading(true);
			await partnerService.requestVideoKyc();
			location.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setRequestKycLoading(false);
		}
	};

	const progreshPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100;

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 text-background px-4 py-28">
			<div className="max-w-7xl mx-auto space-y-16">
				<div>
					<h1 className="text-4xl font-bold"> Partner Onboarding</h1>
					<p className="text-gray-600 mt-3">
						Complete all steps to activate your account
					</p>
				</div>
				<div className="bg-white rounded-3xl p-10  shadow-xl border overflow-x-auto">
					<div className="relative min-w-200 ">
						<div className="absolute top-7 left-0 w-full h-0.75 bg-gray-200 rounded-full" />

						<motion.div
							animate={{ width: `${progreshPercentage}%` }}
							transition={{ duration: 0.6 }}
							className="absolute top-7 left-0 h-0.75 bg-background rounded-full"
						/>
						<div className="relative flex justify-between">
							{STEPS.map(({ id, title, route }) => {
								const complete = id < activeStep;
								const active = id === activeStep;
								const locked = id > activeStep;

								return (
									<motion.div
										key={id}
										whileHover={!locked ? { scale: 1.1 } : {}}
										className="flex flex-col items-center z-10 cursor-pointer "
									>
										<div
											onClick={() => goToStep(id, route)}
											className={` w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${complete ? "bg-background text-white border-background" : active ? "border-background bg-white" : "border-gray-300 text-gray-400 bg-white"}`}
										>
											{complete ? <FaCheck /> : locked ? <CiLock /> : id}
										</div>
										<p className="mt-3 text-sm font-semibold text-center ">
											{title}
										</p>
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>
				{step == 3 && userData.partnerStatus === "rejected" && (
					<RejectionCard
						title="Partner rejected"
						reason={userData.rejectionReason}
						actionLabel="Review and update"
						onAction={() => {
							navigate("/partner/become-partner");
						}}
					/>
				)}
				{step == 3 && userData.partnerStatus === "pending" && (
					<StatusCard
						title="Documents under review"
						icon={FaClockRotateLeft}
						desc="Admin is verifying your documents"
					/>
				)}
				{step == 4 &&
					(step == 4 && userData.videoKycStatus === "rejected" ? (
						<RejectionCard
							title="Video KYC Rejected"
							actionLabel="Request Again"
							reason={userData.videoKycRejectionReason}
							onAction={handleRequestKyc}
							actionLabel={
								requestKycLoading ? "Requesting..." : "Request Again"
							}
						/>
					) : step == 4 &&
					  userData.videoKycStatus === "in_progress" &&
					  userData.videoKycRoomId ? (
						<ActionCard
							icon={FaVideo}
							title="Admin started video kyc"
							button="Join Call"
							onClick={() => {
								navigate(`/video-kyc/${userData.videoKycRoomId}`);
							}}
						/>
					) : (
						<StatusCard
							icon={FaClock}
							title="Waiting for admin"
							desc="Admin will initiate Video KYC shortly."
						/>
					))}
				{step == 5 && step == 5 && userData.videoKycStatus === "approved" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 shadow-lg border flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center"
					>
						<div className="bg-background text-white p-3 md:p-4 rounded-xl shrink-0 self-start">
							<FaCheck />
						</div>
						<div className="flex-1">
							<h1 className="text-base sm:text-lg md:text-xl font-semibold">
								Video KYC Approved
							</h1>
							<p className="text-gray-600 text-sm sm:text-base mt-1">
								Now you can proceed to pricings
							</p>
							<Button
								text={"Set Pricings"}
								onClick={() => setShowPricingModal(true)}
								fill={true}
								className="text-[100px] mt-1"
								style={{ width: "max-content" }}
							/>
						</div>
					</motion.div>
				)}
				{step == 6 && vehicleData.status === "pending" ? (
					<StatusCard
						icon={FaClock}
						title="Pricing Under Review"
						desc="Admin is reviewing your pricings"
					/>
				) : vehicleData.status === "rejected" ? (
					<RejectionCard
						title="Pricing Rejected"
						actionLabel="Request Again"
						reason={vehicleData.rejectionReason}
						onAction={() => {
							setShowPricingModal(true);
						}}
						actionLabel="Edit and resubmit"
					/>
				) : null}
				{step == 7 && vehicleData.status === "approved" && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						className="w-full p-6 bg-background text-white rounded-2xl shadow-2xl"
					>
						<h1 className="text-2xl font-semibold">🚀 You're Live Now</h1>
						<button
							onClick={() => navigate("/partner/bookings")}
							className="mt-6 bg-white text-background px-6 py-3 rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
						>
							Go to Bookings <FaArrowRight />
						</button>
					</motion.div>
				)}
				{userData.role === "partner" &&
					userData.onboardingStep == 7 && <PartnerEarning />}
			</div>

			{showPricingModal && (
				<PricingModal
					data={pricingData}
					onClose={() => setShowPricingModal(false)}
				/>
			)}
		</div>
	);
};

export default PartnerDashboard;
