import React from "react";

import { Hero, VehicleCategories } from "../components/Home/index.js";

import { AdminDashboard } from "./Admin/index.js";
import { PartnerDashboard } from "./Partner/index.js";

import { Footer, Navbar } from "../components/index.js";

import { useSelector } from "react-redux";

const Home = ({ setIsSidebarOpen }) => {
	const role = useSelector((state) => state.user?.data?.role);

	return (
		<>
			<Navbar setIsSidebarOpen={setIsSidebarOpen} />
			{role && role === "admin" ? (
				<AdminDashboard />
			) : role === "partner" ? (
				<PartnerDashboard />
			) : (
				<>
					<Hero />
					<VehicleCategories />
					<Footer />
				</>
			)}
		</>
	);
};

export default Home;
