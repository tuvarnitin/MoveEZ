import React, { useEffect } from "react";
import { partnerService } from "../../../services/partner.service";

const PartnerBookings = () => {
	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await partnerService.fetchAllBookings();
				console.log(response);
			} catch (error) {
				console.log(error);
			}
		};
		fetchBookings();
	}, []);
	return <div></div>;
};

export default PartnerBookings;
