import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	LuCircleDashed,
	LuImagePlus,
	LuIndianRupee,
} from "../../assets/icons/index.js";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "../../components/index.js";

import { vehicleService } from "../../services/vehicle.service.js";

const PricingModal = ({ data, onClose }) => {
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [baseFare, setBaseFare] = useState(0);
	const [pricePerKM, setPricePerKM] = useState(0);
	const [waitingCharge, setWaitingCharge] = useState(0);
	const [imageUrl, setImageUrl] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [vehicleLoading, setVehicleLoading] = useState(false);

	const [errors, setErrors] = useState({});

	const navigate = useNavigate();

	const handleSubmit = async () => {
		const errors = {};
		if (!image && !imageUrl) {
			errors.image = "Please upload an image";
		}
		if (!baseFare) {
			errors.baseFare = "Base fare is required";
		}
		if (!waitingCharge) {
			errors.waitingCharge = "Waiting charges are required";
		}
		if (!pricePerKM) {
			errors.pricePerKM = "Price is required";
		}

		if (Object.keys(errors).length) {
			setErrors(errors);
			return;
		}

		const formData = new FormData();
		formData.append("image", image);
		formData.append("baseFare", baseFare);
		formData.append("waitingCharge", waitingCharge);
		formData.append("pricePerKM", pricePerKM);
		formData.append("imageUrl", imageUrl);

		try {
			setIsLoading(true);
			const result = await vehicleService.setPricing(formData);
			setErrors({});
			onClose();
			window.location.reload();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const handleGetPricing = async () => {
			try {
				setVehicleLoading(true);
				const response = await vehicleService.fetchVehicle();
				if (response.success) {
					setBaseFare(response.vehicle.baseFare);
					setWaitingCharge(response.vehicle.waitingCharge);
					setPricePerKM(response.vehicle.pricePerKM);
					setImageUrl(response.vehicle.imageUrl);
				}
			} finally {
				setVehicleLoading(false);
			}
		};
		handleGetPricing();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
		>
			<AnimatePresence>
				<motion.div
					initial={{ scale: 0.85 }}
					animate={{ scale: 1 }}
					className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
				>
					<div className="p-6 border-b">
						<h2 className="text-xl font-bold">Pricing and Vehicle Image</h2>
						<div className="p-6 space-y-4">
							<label
								className={`relative h-44 border-2 border-dashed ${errors.image ? "border-red-400" : "border-gray-400"} ${isLoading || (vehicleLoading && "opacity-30")} rounded-2xl flex items-center justify-center cursor-pointer`}
							>
								{vehicleLoading ? (
									<div className="absolute inset-0 h-full w-full flex items-center justify-center">
										<LuCircleDashed
											size={30}
											className="animate-spin duration-500"
										/>
									</div>
								) : preview ? (
									<img
										src={preview}
										alt=""
										className="absolute inset-0 w-full h-full object-cover rounded-2xl"
									/>
								) : imageUrl ? (
									<img
										src={imageUrl}
										alt=""
										className="absolute inset-0 w-full h-full object-cover rounded-2xl"
									/>
								) : (
									<LuImagePlus
										size={26}
										className="text-gray-400"
									/>
								)}
								<input
									type="file"
									onChange={(e) => {
										setImage(e.target.files[0]);
										setPreview(URL.createObjectURL(e.target.files[0]));
									}}
									hidden
									disabled={isLoading || vehicleLoading}
								/>
							</label>
							<div>
								<p className="text-sm mb-0.5 text-gray-600 font-semibold">
									Base Fare{" "}
								</p>
								<div
									className={`flex items-center gap-2 border border-gray-500 rounded-xl px-4 py-3 ${vehicleLoading ? "bg-gray-100" : "bg-white"}`}
								>
									{vehicleLoading ? (
										<div className="w-full h-full flex items-center justify-center ">
											<LuCircleDashed
												size={24}
												className="animate-spin"
											/>
										</div>
									) : (
										<>
											<LuIndianRupee />
											<input
												type="text"
												value={baseFare}
												onChange={(e) => setBaseFare(e.target.value)}
												placeholder="100"
												className="w-full outline-none disabled:opacity-30"
												disabled={isLoading || vehicleLoading}
											/>
										</>
									)}
								</div>
								{errors.baseFare && (
									<p className="text-xs text-red-500 ml-2 mt-1">
										{errors.baseFare}
									</p>
								)}
							</div>
							<div>
								<p className="text-sm mb-0.5 text-gray-600 font-semibold">
									Waiting Charge
								</p>
								<div
									className={`flex items-center gap-2 border border-gray-500 rounded-xl px-4 py-3 ${vehicleLoading ? "bg-gray-100" : "bg-white"}`}
								>
									{vehicleLoading ? (
										<div className="w-full h-full flex items-center justify-center ">
											<LuCircleDashed
												size={24}
												className="animate-spin"
											/>
										</div>
									) : (
										<>
											<LuIndianRupee />
											<input
												type="text"
												value={waitingCharge}
												onChange={(e) => setWaitingCharge(e.target.value)}
												placeholder="10"
												className="w-full outline-none disabled:opacity-30"
												disabled={isLoading || vehicleLoading}
											/>
										</>
									)}
								</div>
								{errors.waitingCharge && (
									<p className="text-xs text-red-500 ml-2 mt-1">
										{errors.waitingCharge}
									</p>
								)}
							</div>
							<div>
								<p className="text-sm mb-0.5 text-gray-600 font-semibold">
									Price Per Km
								</p>
								<div
									className={`flex items-center gap-2 border border-gray-500 rounded-xl px-4 py-3 ${vehicleLoading ? "bg-gray-100" : "bg-white"}`}
								>
									{vehicleLoading ? (
										<div className="w-full h-full flex items-center justify-center ">
											<LuCircleDashed
												size={24}
												className="animate-spin"
											/>
										</div>
									) : (
										<>
											<LuIndianRupee />
											<input
												type="text"
												value={pricePerKM}
												onChange={(e) => setPricePerKM(e.target.value)}
												placeholder="8"
												className="w-full outline-none disabled:opacity-30"
												disabled={isLoading || vehicleLoading}
											/>
										</>
									)}
								</div>
								{errors.pricePerKM && (
									<p className="text-xs text-red-500 ml-2 mt-1">
										{errors.pricePerKM}
									</p>
								)}
							</div>
						</div>
						<div className="p-6 border-t flex gap-3">
							<Button
								onClick={onClose}
								text="Cancel"
								fill={false}
							/>
							<Button
								text="Save"
								fill={true}
								onClick={handleSubmit}
								isLoading={isLoading}
							/>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
};

export default PricingModal;
