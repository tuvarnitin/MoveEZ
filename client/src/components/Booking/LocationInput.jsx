import { AnimatePresence, motion } from "motion/react";
import React, { useCallback } from "react";

import { MdAddLocationAlt, IoLocationOutline } from "../../assets/icons/index";

import { debounce } from "../../utils/utility";
import axios from "axios";

const LocationInput = ({
	className,
	value,
	setValue,
	suggestions,
	setSuggestions,
	getCurrentLocation,
	placeholder,
	Icon,
	disabled,
	loading,
	country,
	setCountry,
	setLat,
	setLon,
}) => {
	const searchAddress = async (query, cb, restrict) => {
		if (!query || query.trim().length < 4) return;
		try {
			const {
				data: { features },
			} = await axios.get(
				`https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&limit=6&lang=en`,
			);
			let results = features.map((feature) => ({
				id: feature.properties.osm_id,
				name: feature.properties.name,
				country: feature.properties.country,
				state: feature.properties.state,
				city: feature.properties.county,
				countrycode: feature.properties.countrycode,
				lon: feature.geometry.coordinates[0],
				lat: feature.geometry.coordinates[1],
			}));

			if (restrict) {
				results = results.filter((res) => res.country === restrict);
			}

			cb(results);
		} catch (error) {
			cb([]);
			console.log(error);
		}
	};

	const debounceSearch = useCallback(debounce(searchAddress, 500), []);

	const createFullAddress = (place) =>
		[place.name, place.street, place.city, place.state, place.country]
			.filter(Boolean)
			.join(",");
	return (
		<div className={`relative ${className}`}>
			<div className="flex items-center gap-3 px-4  py-3.5 focus-within:bg-white rounded-t-2xl transition-colors">
				<div className="flex flex-col items-center shrink-0">
					<div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow" />
					{placeholder === "Pickup Location" && (
						<div className="w-px h-5  bg-zinc-300 mt-1" />
					)}
				</div>
				<input
					value={value}
					onBlur={() => setSuggestions([])}
					onChange={(e) => {
						setValue(e.target.value);
						debounceSearch(e.target.value, setSuggestions);
					}}
					disabled={loading || disabled}
					placeholder={placeholder}
					className="flex-1 bg-transparent text-sm font-semibold text-background placeholder:text-zinc-400 outline-none disabled:opacity-65 disabled:animate-pulse"
				/>
				<motion.button
					whileTap={{ scale: 0.88 }}
					className={`w-8 h-8 rounded-xl ${placeholder === "Pickup Location" && "bg-zinc-200 hover:bg-zinc-300"} transition-colors flex items-center justify-center shrink-0`}
					onClick={getCurrentLocation}
				>
					<Icon
						className={`text-zinc-700 ${loading ? "animate-pulse" : "animate-none"}`}
					/>
				</motion.button>
			</div>
			<AnimatePresence>
				{value && suggestions.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -4, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -4, scale: 0.98 }}
						transition={{ duration: 0.2 }}
						className="absolute left-0 right-0 top-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto z-50 cursor-pointer"
					>
						{suggestions.map((suggestion, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: index * 0.03 }}
								onClick={() => {
									setValue(createFullAddress(suggestion));
									setCountry(suggestion.country || "");
									setLat(suggestion.lat || "");
									setLon(suggestion.lon || "");
									setSuggestions([]);
								}}
								className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 text-background cursor-pointer"
							>
								<IoLocationOutline className="text-zinc-400 shrink-0" />
								<span className="text-sm text-zinc-800 font-medium truncate">
									{createFullAddress(suggestion)}
								</span>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default LocationInput;
