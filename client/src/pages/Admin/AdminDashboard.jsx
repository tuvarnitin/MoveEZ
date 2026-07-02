import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { InfoCard, ContentList, Tab } from "../../components/Admin/index.js";

import {
	GrUser,
	GrUserAdmin,
	FaCheck,
	FaTruck,
	CiClock1,
	CiUser,
	FiXCircle,
  FaVideo
} from "../../assets/icons/index.js";

import { adminService } from "../../services/admin.service";
import { authService } from "../../services/auth.service";

const AdminDashboard = () => {
	const [stats, setStats] = useState(null);
	const [activeTab, setActiveTab] = useState("partner");
	const [partnerReviews, setPartnerReviews] = useState([]);
	const [pendingKyc, setPendingKyc] = useState([]);
	const [vehicleReviews, setVehicleReviews] = useState([]);

	useEffect(() => {
		const fetchAdminData = async () => {
			const response = await adminService.fetchAdminData();
			setPartnerReviews(response.pendingPartnerReviews);
			setPendingKyc(response.pendingVideoKyc);
			setStats(response.stats);
			setVehicleReviews(response.pendingVehicles);
		};
		fetchAdminData();
	}, []);
	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 bg-background backdrop-blur-lg border-b z-40 border-zinc-700">
				<div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src="logo.png"
							alt="Logo"
							className="w-30 bg-background"
						/>
					</div>
					<div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white text-background">
						<GrUserAdmin />
						<span className="font-semibold text-xs tracking-wide">Admin</span>
						<button onClick={async () => await authService.logout()}>
							Logout
						</button>
					</div>
				</div>
			</div>
			<main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
					<InfoCard
						label="Total Partners"
						value={stats?.totalPartners}
						Icon={GrUser}
						variant="totalPartners"
					/>
					<InfoCard
						label="Total Approved Partners"
						value={stats?.totalApprovedPartners}
						Icon={FaCheck}
						variant="approved"
					/>
					<InfoCard
						label="Total Pending Partners"
						value={stats?.totalPendingPartners}
						Icon={CiClock1}
						variant="pending"
					/>
					<InfoCard
						label="Total Rejected Partners"
						value={stats?.totalRejectedPartners}
						Icon={FiXCircle}
						variant="rejected"
					/>
				</div>
				<div className="bg-background rounded-2xl p-2 shadow-lg border border-gray-800 flex flex-wrap gap-4">
					<Tab
						active={activeTab === "partner"}
						onClick={() => setActiveTab("partner")}
						count={partnerReviews.length ?? 0}
						icon={CiUser}
					>
						Partner Reviews
					</Tab>
					<Tab
						active={activeTab === "kyc"}
						onClick={() => setActiveTab("kyc")}
						count={pendingKyc.length ?? 0}
						icon={FaVideo}
					>
						Pending Video KYC
					</Tab>
					<Tab
						active={activeTab === "vehicle"}
						onClick={() => setActiveTab("vehicle")}
						count={vehicleReviews.length ?? 0}
						icon={FaTruck}
					>
						Pending Vehicel Reviews
					</Tab>
				</div>
				<AnimatePresence>
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="space-y-3"
					>
						{activeTab === "partner" && (
							<ContentList
								data={partnerReviews || []}
								type="partner"
							/>
						)}
						{activeTab === "kyc" && (
							<ContentList
								data={pendingKyc || []}
								type="kyc"
							/>
						)}
						{activeTab === "vehicle" && (
							<ContentList
								data={vehicleReviews || []}
								type="vehicle"
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</main>
		</div>
	);
};

export default AdminDashboard;
