import React, { useEffect, useState } from "react";

import { pickUpIcon, dropIcon } from "./markers.js";

import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";

import axios from "axios";

import { AnimatePresence, motion } from "motion/react";

import { CiLocationOn, CiMapPin } from "../../assets/icons/index.js";
import MapLoader from "./MapLoader.jsx";

function FitBounds({ position1, dropCoords }) {
	const map = useMap();
	map.invalidateSize();
	useEffect(() => {
		map.fitBounds([position1, dropCoords], {
			padding: [50, 50],
			maxZoom: 15,
			animate: true,
		});
	}, []);
	return null;
}

const Map = ({
	drop,
	pickUp,
	onChange,
	onDistance,
	pickUpLat,
	pickUpLon,
	dropLon,
	dropLat,
}) => {
	const [pickUpCoords, setPickUpCoords] = useState([pickUpLat, pickUpLon]);
	const [dropCoords, setDropCoords] = useState([dropLat, dropLon]);
	const [km, setKm] = useState(0);
	const [route, setRoute] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		if (!pickUpCoords && !dropCoords) return;
		const loadRoute = async (pickUpCoords, dropCoords) => {
			try {
				const { data } = await axios.get(
					`https://router.project-osrm.org/route/v1/driving/${pickUpCoords[1]},${pickUpCoords[0]};${dropCoords[1]},${dropCoords[0]}?overview=full&geometries=geojson`,
				);
				// Setting Route Coordinates
				if (data?.routes?.length) {
					setRoute(
						data.routes[0].geometry.coordinates.map((coordinates) => [
							coordinates[1],
							coordinates[0],
						]),
					);
					// Setting distance (Distance From the pickup to drop)
					const distance = Number((data.routes[0].distance / 1000).toFixed(2));
					setKm(distance);
					onDistance(distance);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		loadRoute(pickUpCoords, dropCoords);
	}, [pickUpCoords, dropCoords]);

	const handleDrag = async (lat, lon, setPosition) => {
		setPosition([lat, lon]);
	};

	return (
		<div className="relative w-full h-full bg-zinc-100">
			{!loading ? (
				<MapContainer
					center={[0, 0]}
					style={{
						width: "100%",
						height: "100%",
					}}
					zoomControl={false}
				>
					<TileLayer
						attribution='&copy; <a href="https://carto.com">CARTO</a> contributors'
						url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
					/>
					<FitBounds
						position1={pickUpCoords}
						dropCoords={dropCoords}
					/>
					{pickUpCoords && (
						<Marker
							icon={pickUpIcon}
							position={pickUpCoords}
							draggable
							eventHandlers={{
								dragend: (e) => {
									const latlon = e.target.getLatLng();
									handleDrag(latlon.lat, latlon.lng, setPickUpCoords);
								},
							}}
						></Marker>
					)}
					{dropCoords && (
						<Marker
							position={dropCoords}
							icon={dropIcon}
							draggable
							eventHandlers={{
								dragend: (e) => {
									const coords = e.target.getLatLng();
									handleDrag(coords.lat, coords.lng, setDropCoords);
								},
							}}
						></Marker>
					)}

					{route.length && (
						<>
							<Polyline
								positions={route}
								pathOptions={{
									color: "#0a0a0a",
									weight: 4,
									lineCap: "round",
									lineJoin: "round",
								}}
							/>
						</>
					)}
				</MapContainer>
			) : (
				<MapLoader />
			)}
		</div>
	);
};

export default Map;
