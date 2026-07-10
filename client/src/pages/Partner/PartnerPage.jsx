import React from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "../../components/index.js";
import { Navbar } from "../../components/Partner/index.js";


const PartnerPage = ({ setIsSidebarOpen }) => {
	return (
		<div>
			<Navbar setIsSidebarOpen={setIsSidebarOpen } />
			<Outlet />
		</div>
	);
};

export default PartnerPage;
