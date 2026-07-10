import React from "react";

import { Hero, VehicleCategories } from "../components/Home/index.js";

import { AdminDashboard } from "./Admin/index.js";
import { PartnerPage } from "./Partner/index.js";

import { Footer, Navbar } from "../components/index.js";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = ({ setIsSidebarOpen }) => {
	const role = useSelector((state) => state.user?.data?.role);

	return (
		<>
			{role && role === "admin" ? (
				<AdminDashboard />
			) : role === "partner" ? (
				<Navigate to={"/partner"} />
			) : (
				<>
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
