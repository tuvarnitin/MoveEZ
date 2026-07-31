import React from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "../../components/index.js";
import { SideBar } from "../../components/Partner/index.js";
import { Navbar } from "../../components/Partner/index.js";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

const NAV_LINKS = [
	{
		title: "Home",
		to: "/partner",
	},
	{
		title: "Pending Requests",
		to: "/partner/pending-requests",
	},
	{
		title: "Bookings",
		to: "/partner/bookings",
	},
	{
		title: "Active Ride",
		to: "/partner/active-ride",
	}
];

const PartnerPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div>
			<Navbar setIsSidebarOpen={setIsSidebarOpen} />
			<AnimatePresence mode="popLayout">
				{isSidebarOpen && (
					<SideBar
						links={NAV_LINKS}
						setIsSidebarOpen={setIsSidebarOpen}
					/>
				)}
			</AnimatePresence>
			<Outlet />
		</div>
	);
};

export default PartnerPage;
