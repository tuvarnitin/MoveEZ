import React from "react";
import { Outlet } from "react-router-dom";

import { Navbar, Footer } from "../../components/index.js";

const PartnerPage = ({ setIsSidebarOpen }) => {
	return (
		<div>
			<Navbar setIsSidebarOpen={setIsSidebarOpen } />
			<Outlet />
		</div>
	);
};

export default PartnerPage;
