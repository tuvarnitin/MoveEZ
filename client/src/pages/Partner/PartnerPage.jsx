import React from "react";
import { Outlet } from "react-router-dom";

import { Navbar, Footer } from "../../components/index.js";

const PartnerPage = () => {
	return (
		<div>
			<Navbar />
			<Outlet />
		</div>
	);
};

export default PartnerPage;
