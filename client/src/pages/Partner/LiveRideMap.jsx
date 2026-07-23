import React, { useEffect, useState } from "react";

import { pickUpIcon, dropIcon, driverIcon } from "./marker.js";

import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

import axios from "axios";

import { AnimatePresence, motion } from "motion/react";
import useRoute from "../../hooks/useRoute.js";

const LiveRideMap = ({
	driverLocation,
	pickUpLocation,
	dropLocation,
	mapStatus,
	onUpdate,
}) => {
	const [loading, setLoading] = useState(false);
	const [driverToPickUpRoute, setDriverToPickUpRoute] = useState([]);
	const [pickUpToDropRoute, setPickUpToDropRoute] = useState([]);

	const { loadRoute } = useRoute();
	const handleRoute = async (start, end) => {
		const data = await loadRoute(start, end);
		return data;
	};
	useEffect(() => {
		const fetchRoutes = async () => {
			const {
				routes: driverToPickUp,
				distance: pickUpDistance,
				duration: estTimeToPickUp,
			} = await handleRoute(driverLocation, pickUpLocation);

			const {
				routes: pickUpToDrop,
				distance: dropDistance,
				duration: estTimeToDrop,
			} = await handleRoute(driverLocation, dropLocation);

			if (mapStatus === "arriving" || mapStatus === "confirmed") {
				setPickUpToDropRoute([]);
				setDriverToPickUpRoute(driverToPickUp);
			} else if (mapStatus === "started") {
				setDriverToPickUpRoute([]);
				setPickUpToDropRoute(pickUpToDrop);
			}
			onUpdate(pickUpDistance, dropDistance, estTimeToPickUp, estTimeToDrop);
		};
		fetchRoutes();
	}, [dropLocation, pickUpLocation, driverLocation,mapStatus]);
    
	const showDriverToPickUpRoute =
		mapStatus === "arriving" || mapStatus === "confirmed";
	const showPickUpToDropRoute = mapStatus === "started";

	return (
		<div className="relative w-full h-full bg-zinc-100">
			<MapContainer
				center={pickUpLocation}
				style={{
					width: "100%",
					height: "100%",
				}}
				zoom={13}
				zoomControl={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://carto.com">CARTO</a> contributors'
					url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
				/>
				{showDriverToPickUpRoute && pickUpLocation && (
					<Marker
						icon={pickUpIcon}
						position={pickUpLocation}
					></Marker>
				)}
				{dropLocation && (
					<Marker
						position={dropLocation}
						icon={dropIcon}
					></Marker>
				)}
				{driverLocation && (
					<Marker
						position={driverLocation}
						icon={driverIcon}
					></Marker>
				)}

				{showDriverToPickUpRoute && driverToPickUpRoute.length && (
					<Polyline
						positions={driverToPickUpRoute}
						pathOptions={{
							color: "#888",
							weight: 4,
							lineCap: "round",
							dashArray: "2 10",
						}}
					/>
				)}

				{showPickUpToDropRoute && pickUpToDropRoute.length && (
					<Polyline
						positions={pickUpToDropRoute}
						pathOptions={{
							color: "#0a0a0a",
							weight: 4,
							lineCap: "round",
							lineJoin: "round",
						}}
					/>
				)}
			</MapContainer>
		</div>
	);
};

export default LiveRideMap;
