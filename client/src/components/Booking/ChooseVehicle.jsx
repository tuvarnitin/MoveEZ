import React from "react";
import { motion } from "motion/react";

import { VehicleCard } from "../../components/Booking/index";
import { SectionTitle } from "../Booking/index.js";

import { VEHICLES } from "../../constant/index.js"

const ChooseVehicle = ({ variants, vehicle, setVehicle }) => {
	return (
		<motion.div
			variants={variants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.05 }}
		>
			<div className="grid grid-cols-2 gap-2.5">
				{VEHICLES.map((v, index) => {
					const active = v.id == vehicle;
					return (
						<VehicleCard
							key={index}
							index={index}
							v={v}
							active={active}
							setVehicle={setVehicle}
						/>
					);
				})}
			</div>
		</motion.div>
	);
};

export default ChooseVehicle;
