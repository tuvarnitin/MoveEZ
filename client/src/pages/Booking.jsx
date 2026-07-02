import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { animate, AnimatePresence, motion, scale } from "motion/react";

import {
	FaArrowLeft,
	FaCar,
	FaChevronRight,
	FaMapPin,
	FaS,
	FaTruck,
	FiCheckCircle,
	PiPhone,
	MdAddLocationAlt,
	IoLocationOutline,
	CiLocationArrow1,
	TiLocationArrow
} from "../assets/icons/index"

import {
	Header,
	VehicleCard,
	PhoneInput,
	ChooseVehicle,
	SectionTitle,
	LocationInput,
	ContinueButton,
} from "../components/Booking/index";

import { debounce } from "../utils/utility";
import axios from "axios";

const variants = {
	hidden: {
		opacity: 0,
		y: 16,
	},
	visible: {
		opacity: 1,
		y: 0,
	},
};

const Booking = () => {
	const navigate = useNavigate();

	const [vehicle, setVehicle] = useState("");
	const [mobile, setMobile] = useState("");

	const [pickUp, setPickUp] = useState("");
	const [pickUpCountry, setPickUpCountry] = useState("");
	const [pickUpLon, setPickUpLon] = useState("");
	const [pickUpLat, setPickUpLat] = useState("");
	const [pickUpSuggestions, setPickUpSuggestions] = useState([]);

	const [drop, setDrop] = useState("");
	const [dropCountry, setDropCountry] = useState("");
	const [dropLon, setDropLon] = useState("");
	const [dropLat, setDropLat] = useState("");
	const [dropSuggestions, setDropSuggestions] = useState([]);

	const [locationLoading, setLocationLoading] = useState(false);

	const progressSteps = [
		!!vehicle,
		!!(mobile.length == 10),
		!!pickUp,
		!!drop,
	].filter(Boolean).length;

	const canContinue = !!(
		vehicle &&
		mobile.length == 10 &&
		pickUp &&
		drop &&
		pickUpLat &&
		pickUpLon &&
		dropLat &&
		dropLon
	);

	const getCurrentLocation = () => {
		setLocationLoading(true);
		if (!navigator.geolocation) return;

		const position = navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				try {
					const { data } = await axios.get(
						`https://photon.komoot.io/reverse?lon=${coords.longitude}&lat=${coords.latitude}`,
					);
					if (data.features.length) {
						const properties = data.features[0].properties;
						const address = [
							properties.name,
							properties.street,
							properties.city,
							properties.state,
							properties.country,
						]
							.filter(Boolean)
							.join(",");
						setPickUp(address);
						setPickUpCountry(properties.country);
						setPickUpLon(coords.longitude);
						setPickUpLat(coords.latitude);
					}
				} catch (error) {
					console.log(error);
				} finally {
					setLocationLoading(false);
				}
			},
		);
	};

	return (
		<div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
			<motion.div
				initial={{ opacity: 0, y: 32 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: [0.22, 1, 0.36, 1] }}
				className="w-full max-w-md"
			>
				{/* Header */}
				<Header progressSteps={progressSteps} />
				{/* Main */}
				<div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-visible">
					<div className="h-0.5 bg-zinc-900 w-[90%] rounded-full mx-auto" />
					<div className="p-6 space-y-6">
						{/* Choose Vehicle */}
						<SectionTitle
							step={1}
							title={"Choose Vehicle"}
						/>
						<ChooseVehicle
							variants={variants}
							vehicle={vehicle}
							setVehicle={setVehicle}
						/>
						<div className="h-px bg-zinc-200" />

						{/* Phonse Input */}
						<SectionTitle
							step={2}
							title={"Mobile Number"}
						/>
						<PhoneInput
							mobile={mobile}
							setMobile={setMobile}
							variants={variants}
						/>
						<div className="h-px bg-zinc-200" />
						<SectionTitle
							step={3}
							title={"Route"}
						/>
						<motion.div
							variants={variants}
							initial="hidden"
							animate="visible"
							transition={{ delay: 0.05 }}
						>
							<div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-visible">
								<LocationInput
									className="z-20"
									country={pickUpCountry}
									setCountry={setPickUpCountry}
									setLat={setPickUpLat}
									setLon={setPickUpLon}
									value={pickUp}
									setValue={setPickUp}
									suggestions={pickUpSuggestions}
									setSuggestions={setPickUpSuggestions}
									placeholder="Pickup Location"
									Icon={MdAddLocationAlt}
									getCurrentLocation={getCurrentLocation}
									loading={locationLoading}
								/>
								<div className="h-px bg-zinc-200" />
								<LocationInput
									className={`z-10 ${!pickUpCountry && "opacity-30"}`}
									country={dropCountry}
									setCountry={setDropCountry}
									setLat={setDropLat}
									setLon={setDropLon}
									value={drop}
									setValue={setDrop}
									suggestions={dropSuggestions}
									setSuggestions={setDropSuggestions}
									setSuggestions={setDropSuggestions}
									placeholder="Drop Location"
									Icon={CiLocationArrow1}
									disabled={!pickUpCountry}
								/>
							</div>
						</motion.div>
						<ContinueButton
							variants={variants}
							canContinue={canContinue}
							pickUp={pickUp}
							pickUpLat={pickUpLat}
							pickUpLon={pickUpLon}
							drop={drop}
							dropLat={dropLat}
							dropLon={dropLon}
							mobile={mobile}
							vehicle={vehicle}
						/>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default Booking;
