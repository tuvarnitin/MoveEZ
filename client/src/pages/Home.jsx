import React from "react";

import { Hero, VehicleCategories } from "../components/Home/index.js";

import { AdminDashboard } from "./Admin/index.js";
import { PartnerPage } from "./Partner/index.js";

import { Footer, Navbar, SideBar } from "../components/index.js";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

const NAV_LINKS = [
	{
		title: "Home",
		to: "/",
	},
	{
		title: "Bookings",
		to: "/bookings",
	},
	{
		title: "About US",
		to: "/about-us",
	},
	{
		title: "Contact US",
		to: "/contact",
	},
];

const Home = () => {
	const role = useSelector((state) => state.user?.data?.role);

	const [isSidebarOpen,setIsSidebarOpen] = useState(false)

	return (
		<>
			{role && role === "admin" ? (
				<AdminDashboard />
			) : role === "partner" ? (
				<Navigate to={"/partner"} />
			) : (
				<>
					<AnimatePresence mode="popLayout">
						{isSidebarOpen && (
							<SideBar
								links={NAV_LINKS}
								setIsSidebarOpen={setIsSidebarOpen}
							/>
						)}
					</AnimatePresence>
					<Navbar setIsSidebarOpen={setIsSidebarOpen} />
					<Hero />
					<VehicleCategories />
					<Footer />
				</>
			)}
		</>
	);
};

export default Home;
