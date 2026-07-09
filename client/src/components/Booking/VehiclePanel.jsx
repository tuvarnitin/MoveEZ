import React, { useEffect } from 'react'

import {motion} from "motion/react"
import { FaGauge, FaStar } from 'react-icons/fa6';
import { LuIndianRupee } from 'react-icons/lu';
import { CiLock } from 'react-icons/ci';
import useNearbyVehicles from '../../hooks/useNearbyVehicles';
import { MdArrowRight } from 'react-icons/md';

const VehiclePanel = ({
    vehicles,
	VEHICLES_METAS,
	km,
	pickUpLat,
	pickUpLon,
	vehicleType,
    setLoading,
    onBook
}) => {

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{vehicles.map((v, index) => {
				const { Icon, label } = VEHICLES_METAS[v.type];
				const estimate = Math.round(
					Number(v.baseFare) + Number(v.pricePerKM) * km,
				);
				return (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: index * 0.06,
							duration: 0.38,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ y: -6 }}
							transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
							className="relative bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col group cursor-default"
							style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
						>
							<div className="relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden">
								<div
									className="absolute inset-0 opacity-[0.04]"
									style={{
										backgroundImage:
											"linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
										backgroundSize: "24px 24px",
									}}
								/>
								<motion.img
									src={v.imageUrl}
									alt={v.vehicleModel}
									className="relative z-10 h-32 w-full object-contain"
									style={{
										filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.14))",
									}}
									whileHover={{
										scale: 1.06,
										filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.22))",
									}}
									transition={{ duration: 0.35 }}
								/>
								<div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full ">
									<Icon size={10} />
									{label}
								</div>

								<div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-white border border-zinc-200 text-zinc-700 text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm ">
									<FaStar
										size={9}
										className="text-background fill-background"
									/>{" "}
									4.8
								</div>
							</div>
							<div className="h-px bg-zinc-100" />
							<div className="flex flex-col flex-1 p-5 gap-4">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<h3 className="text-zinc-900 text-base font-black tracking-tight leading-tight truncate">
											{v.model}
										</h3>

										<div className="mt-1.5 inline-flex items-center bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
											<span className="text-zinc-500 text-xs font-black tracking-[0.2em] font-mono uppercase">
												{v.number}
											</span>
										</div>
									</div>

									<div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
										<Icon
											size={17}
											className="text-zinc-700"
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-3.5 py-3">
										<div className="flex items-center gap-1.5 mb-1">
											<FaGauge
												size={11}
												className="text-zinc-400"
											/>
											<p className="text-zinc-400 text-[9px] uppercase tracking-widest font-bold">
												Per KM
											</p>
										</div>

										<p className="text-zinc-900 text-sm flex items-center font-black">
											<LuIndianRupee size={12} />
											{v.pricePerKM}
										</p>
									</div>
									<div className=" bg-zinc-50 border  border-zinc-100 rounded-2xl px-3.5 py-3">
										<div className="flex items-center gap-1.5 mb-1">
											<CiLock
												size={11}
												className=" text-zinc-400"
											/>
											<p className=" text-zinc-400 text-[9px] uppercase tracking-widest font-bold">
												Waiting
											</p>
										</div>
										<div className=" text-zinc-900 text-sm  flex items-center">
											<LuIndianRupee size={11} />
											<span className="font-black">{v.waitingCharge}</span>
											<span>/min</span>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between pt-3 border-t border-zinc-100">
									<div>
										<p className=" text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-0.5">
											Est. Fare
										</p>
										<motion.div
											key={v._id}
											initial={{ opacity: 0, y: 5 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.25 }}
											className="flex items-baseline gap-0.5"
										>
											<LuIndianRupee
												size={16}
												className="text-background mb-0.5"
												strokeWidth={2.5}
											/>
											<span className="text-background text-3xl font-black tracking-tight leading-none">
												{estimate}
											</span>
										</motion.div>
									</div>
									<motion.button
										whileTap={{ scale: 0.92 }}
										whileHover={{ scale: 1.04 }}
										onClick={() => onBook(v)}
										className=" flex items-center gap-2 bg-zinc-900 hover:bg-black text-white text-sm font-black px-6 py-3.5 rounded-2xl transition-colors shadow-md cursor-pointer"
									>
										Book
										<motion.div
											initial={{}}
											whileHover={{ x: 3 }}
											transition={{ duration: 0.2 }}
										>
											<MdArrowRight />
										</motion.div>
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				);
			})}
		</div>
	);
};

export default VehiclePanel