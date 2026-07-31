import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	FiBarChart2,
	FiTrendingDown,
	FiTrendingUp,
	FiZap,
	FaStar,
} from "../../assets/icons/index.js";
import {
	ResponsiveContainer,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Bar,
	Cell,
} from "recharts";
import { partnerService } from "../../services/partner.service";

const PartnerEarning = () => {
	const [earnings, setEarnings] = useState([
		{
			date: "",
			earnings: 0,
		},
	]);

	useEffect(() => {
		const fetchEarning = async () => {
			try {
				const response = await partnerService.getTotalEarning();
				const lastSevenDaysEarnings = response.earning.slice(-7);
				setEarnings(lastSevenDaysEarnings);
			} catch (error) {
				console.log(error);
			}
		};
		fetchEarning();
	}, []);

	const totalEarning = earnings.reduce((a, b) => a + b.earnings, 0);
	const avgEarning = earnings.length
		? Math.round(totalEarning / earnings.length)
		: 0;
	const maxEarning = earnings.length
		? Math.max(...earnings.map((e) => e.earnings))
		: 0;
	const bestEarning = earnings.find((e) => e.earnings === maxEarning);
	const todayEarning = earnings[earnings.length - 1];
	const yesterdayEarning = earnings[earnings.length - 2];
	const delta =
		todayEarning && yesterdayEarning
			? todayEarning.earnings - yesterdayEarning.earnings
			: 0;
	const isDeltaPositive = delta >= 0;
	const deltaPercentage = yesterdayEarning
		? Math.abs(Math.round((delta / yesterdayEarning.earnings) * 100))
		: 0;

	const formatPrice = (num) => {
		return "₹" + num;
	};

	const metrics = [
		{
			label: "Best Day",
			value: formatPrice(maxEarning),
			sub: bestEarning?.date ?? "-",
			icon: <FaStar size={14} />,
			color: "text-violet-600",
			bg: "text-violet-50",
		},
		{
			label: "Daily Average",
			value: formatPrice(avgEarning),
			sub: "Per day",
			icon: <FiBarChart2 size={14} />,
			color: "text-blue-600",
			bg: "text-blue-50",
		},
		{
			label: "Today",
			value: todayEarning ? formatPrice(todayEarning.earnings) : "-",
			sub:
				todayEarning && yesterdayEarning
					? `${isDeltaPositive ? "+" : ""}${formatPrice(delta)} vs Yesterday`
					: "-",
			icon: <FiZap size={14} />,
			color: "text-emerald-600",
			bg: "text-emerald-50",
		},
	];

	return (
		<div className="rounded-3xl border border-zinc-800 shadow-sm p-6 w-full">
			<div className="flex items-start justify-between mb-6 flex-wrap gap-4 ">
				<div>
					<span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
						Partner Dashboard
					</span>
					<h2 className="text-xl font-bold text-white tracking-tight">
						Daily Earnings
					</h2>
				</div>
				<div className="text-right">
					<p className="text-sm text-gray-400 mt-0.5">
						Last 7 Days performance
					</p>
					<motion.div
						key={totalEarning}
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-3xl font-bold font-mono tracking-tight"
					>
						{formatPrice(totalEarning)}
					</motion.div>
					<div
						className={`flex items-center justify-end gap-1 text-xs font-semibold mt-1 ${
							isDeltaPositive ? "text-emerald-600" : "text-rose-500"
						}`}
					>
						{isDeltaPositive ? (
							<FiTrendingUp size={13} />
						) : (
							<FiTrendingDown size={13} />
						)}
						<span>{deltaPercentage}% vs Yesterday</span>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-3 mb-6">
				{metrics.map((m, i) => (
					<motion.div
						key={m.label}
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.07, duration: 0.4 }}
						className="bg-zinc-900 rounded-2xl p-4"
					>
						<div
							className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-2 ${m.color}`}
						>
							<span className={`${m.bg} p-1 rounded-lg ${m.color}`}>
								{m.icon}
							</span>
							{m.label}
						</div>
						<p className="text-lg font-bold text-white font-mono leading-none">
							{m.value}
						</p>
						<p className="text-[11px] text-gray-400 mt-1">{m.sub}</p>
					</motion.div>
				))}
			</div>
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0, scaleY: 0.92 }}
					animate={{ opacity: 1, scaleY: 1 }}
					transition={{ duration: 0.45, ease: "easeOut" }}
					className="h-56"
				>
					<ResponsiveContainer
						width="100%"
						height="100%"
					>
						<BarChart
							data={earnings}
							barCategoryGap={"30%"}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#444"
								vertical={false}
							/>
							<XAxis
								dataKey="date"
								tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
								axisLine={false}
								tickLine={false}
							/>

							<YAxis
								tick={{ fontSize: 11, fill: "#9ca3af" }}
								axisLine={false}
								tickLine={false}
								tickFormatter={(v) =>
									"₹" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)
								}
							/>
							<Bar
								dataKey={"earnings"}
								radius={[8, 8, 3, 3]}
							>
								{earnings.map((earning, index) => {
									const isToday = index === earnings.length - 1;
									const isBest = earning.earnings === maxEarning && !isToday;
									return (
										<Cell
											key={`cell-${index}`}
											fill={
												isToday ? "#10b981" : isBest ? "#8b5cf6" : "#bfdbfe"
											}
										/>
									);
								})}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default PartnerEarning;
