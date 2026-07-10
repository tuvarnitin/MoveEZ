import React from "react";
import { AnimatePresence, motion } from "motion/react";

import {
	PiCreditCardLight,
	FiShield,
	FiXCircle,
	CiClock1,
	FaArrowRight,
	RiLoader2Line,
	FaCheckCircle,
	GiBanknote,
} from "../../assets/icons/index.js";

import { PAYMENT_METHODS } from "../../contant/index.js";

import {  useState ,useEffect } from "react";
import Button from "../Button.jsx";

const CheckoutRight = ({
	status,
	setStatus,
	handleCancelRequest,
	handleRequestBooking,
	loading,
}) => {
	const [paymentMethod, setPaymentMethod] = useState("cash");
	useEffect(() => {
		if (status !== "awaiting_payment") return;
		const t = setTimeout(() => {
			setStatus("payment");
		}, 2000);
	}, [status]);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				delay: 0.14,
				duration: 0.5,
				ease: [0.22, 1, 0.36, 1],
			}}
			className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col"
		>
			<div className="h-1 bg-zinc-900" />
			<div className="flex-1 p-8 sm:p-10 flex flex-col">
				<AnimatePresence mode="wait">
					{status == "idle" && (
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col flex-1 justify-between"
						>
							<div>
								<p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1">
									Ready to go?
								</p>
								<h3 className="text-2xl font-black text-zinc-900 mb-6">
									Confirm Your Ride
								</h3>
								<div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 space-y-4">
									{[
										{
											icon: <CiClock1 size={14} />,
											text: "Driver will respond within 2 minutes",
										},
										{
											icon: <FiShield size={14} />,
											text: "Verified & insured drivers only",
										},
										{
											icon: <PiCreditCardLight size={14} />,
											text: "Pay after driver accepts",
										},
									].map((item, i) => (
										<div
											key={i}
											className="flex items-center gap-3"
										>
											<div className="w-7 h-7 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
												{item.icon}
											</div>
											<p className="text-zinc-500 text-xs font-medium">
												{item.text}
											</p>
										</div>
									))}
								</div>
							</div>
							{/* <motion.button
								whileTap={{ scale: 0.97 }}
								whileHover={{ scale: 1.02 }}
								onClick={handleRequestBooking}
								className="w-full h-14 mt-8 bg-zinc-900 hover:bg-black disabled:opacity-40 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-colors shadow-md cursor-pointer"
							>
								<span>Request Ride </span>
								<FaArrowRight size={15} />
							</motion.button> */}
							<Button
								text={`Request Ride`}
								icon={<FaArrowRight />}
								isLoading={loading}
								onClick={handleRequestBooking}
							/>
						</motion.div>
					)}
					{status === "requested" && (
						<motion.div
							key="requested"
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.35 }}
							className="flex flex-col flex-1 items-center justify-center gap-6 text-center"
						>
							<div className="relative">
								<motion.div
									animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="absolute inset-0 rounded-full bg-zinc-900"
								/>
								<div className="relative w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center">
									<RiLoader2Line
										size={28}
										className="text-zinc-900 animate-spin"
									/>
								</div>
							</div>
							<motion.div
								onClick={() => handleCancelRequest()}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 hover:border-zinc-400 px-4 py-2.5 rounded-xl cursor-pointer"
							>
								<FiXCircle size={13} /> Cancel Request
							</motion.div>
						</motion.div>
					)}
					{status === "awaiting_payment" && (
						<motion.div
							key="awaiting_payment"
							initial={{ opacity: 0, scale: 0.94 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.35 }}
							className="flex flex-col flex-1 items-center justify-center gap-5 text-center"
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									type: "spring",
									stiffness: 260,
									damping: 16,
								}}
								className="w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center"
							>
								<FaCheckCircle
									size={36}
									className="text-zinc-900"
								/>
							</motion.div>
							<div>
								<h3 className="text-xl font-black text-zinc-900 mb-1">
									Driver Accepted Ride
								</h3>
								<p className="text-zinc-400 text-sm font-medium">
									Preparing payment options...
								</p>
							</div>

							<div className="w-48 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: "100%" }}
									transition={{ duration: 2 }}
									className="h-full bg-zinc-900 rounded-full"
								/>
							</div>
						</motion.div>
					)}
					{status === "payment" && (
						<motion.div
							key="payment"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col flex-1 gap-6 text-background"
						>
							<div>
								<p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1">
									Almost There
								</p>
								<h3 className="text-2xl font-black text-zinc-900">
									Select Payment Method
								</h3>
							</div>

							<div className="space-y-3">
								{PAYMENT_METHODS.map((p, i) => {
									const active = paymentMethod === p.id;
									return (
										<motion.div
											key={p.id}
											whileTap={{ scale: 0.97 }}
											onClick={() => setPaymentMethod(p.id)}
											className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
												active
													? "bg-zinc-900 border-zinc-900 text-white"
													: "bg-zinc-50 border-zinc-100 hover:border-zinc-400"
											}`}
										>
											<div
												className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
													active ? "bg-white/10" : "bg-zinc-200"
												}`}
											>
												<p.Icon
													size={18}
													className={active ? "text-white" : "text-zinc-600"}
												/>
											</div>

											<div className="flex-1 min-w-0">
												<p
													className={`text-sm font-bold ${active ? "text-white" : "text-zinc-900"}`}
												>
													{p.title}
												</p>
												<p
													className={`text-xs font-medium ${active ? "text-zinc-400" : "text-zinc-400"}`}
												>
													{p.sub}
												</p>
											</div>
											<AnimatePresence>
												{active && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														exit={{ scale: 0 }}
													>
														<FaCheckCircle
															size={16}
															className="text-white shrink-0"
														/>
													</motion.div>
												)}
											</AnimatePresence>
										</motion.div>
									);
								})}
							</div>
							<motion.button
								whileTap={{ scale: 0.97 }}
								whileHover={paymentMethod ? { scale: 1.02 } : {}}
								disabled={!paymentMethod}
								className="w-full h-14 bg-zinc-900 hover:bg-black disabled:opacity-30 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-colors shadow-md mt-auto"
							>
								{paymentMethod === "cash" ? (
									<>
										<GiBanknote size={16} />
										<span>Confirm Cash Ride</span>
									</>
								) : (
									<>
										<span>Proceed to Payment</span>
										<FaArrowRight size={16} />
									</>
								)}
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};

export default CheckoutRight;
