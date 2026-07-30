import React, { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";

import { FaX, FiSend, IoSparkles } from "../assets/icons/index.js";

import { getSocket } from "../socket.io/socketIo.js";
import { chatServices } from "../services/chat.service.js";

const RideChat = ({ currentRole, bookingId, userName, driverName }) => {
	const otherName = currentRole === "user" ? driverName : userName;
	const myName = currentRole === "user" ? userName : driverName;
	const [messages, setMessage] = useState([]);
	const [lastMessages, setLastMessage] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [suggestionLoading, setSuggestionLoading] = useState(false);
	const [showAiSuggestions, setShowAiSuggestions] = useState(false);
	const [text, setText] = useState("");
	const user = useSelector((state) => state.user.data);
	const messageBoxEndRef = useRef(null);

	useEffect(() => {
		const socket = getSocket();
		socket.on("message", (data) => {
			setMessage((prev) => [...prev, data.msg]);
		});
		return () => {
			socket.off("message");
		};
	}, []);

	const sendMessage = async () => {
		try {
			const socket = getSocket();
			setShowAiSuggestions(false);
			const response = await chatServices.sendMessage({
				sender: currentRole,
				text,
				bookingId,
			});
			setText("");
			socket.emit("message", { msg: response.msg });
		} catch (error) {
			console.log(error);
		}
	};

	const getAllMessage = async () => {
		try {
			const response = await chatServices.getAllMessage({ bookingId });
			setMessage(response.msgs);
			setLastMessage(response.msgs[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const getAiSuggestions = async () => {
		try {
			setShowAiSuggestions(true);
			setSuggestionLoading(true);
			const response = await chatServices.getAiSuggestions({
				lastMessages,
				role: currentRole,
			});
			const json = JSON.parse(response.suggestions[0].text).suggestions;
			setSuggestions(json);
		} catch (error) {
			console.log(error);
		} finally {
			setSuggestionLoading(false);
		}
	};

	const formatTime = (dateInput) => {
		const date = new Date(dateInput);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};
	useEffect(() => {
		getAllMessage();
		// getAiSuggestions();
	}, []);

	useEffect(() => {
		if (!messageBoxEndRef.current) return;
		messageBoxEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col h-full min-h-0 bg-white text-background rounded-2xl overflow-hidden border border-zinc-100">
			<div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100">
				<div className="relative shrink-0">
					<div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white text-xs font-bold">
						{otherName.charAt(0).toUpperCase()}
					</div>
					<span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-bold text-zinc-900 leading-none">
						{otherName}
					</p>
					<p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
						Active Now
					</p>
				</div>
			</div>
			<div
				className="flex-1 h-screen overflow-y-scroll px-4 py-4 space-y-3 bg-zinc-50"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full gap-3 py-16">
						<div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
							<FiSend
								size={18}
								className="text-zinc-400"
							/>
						</div>
						<p className="text-sm text-zinc-400 font-medium">No messages yet</p>
						<p className="text-xs text-zinc-300">
							Start the conversation below
						</p>
					</div>
				)}
				<div className="w-full h-fit space-y-1">
					{messages.length > 0 &&
						messages.map((m, i) => {
							const isMine = m.sender === currentRole;
							return (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: 8, scale: 0.97 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
									className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-[72%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl shadow-sm ${
											isMine
												? "bg-zinc-950 text-white rounded-br-sm"
												: "bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm"
										}`}
									>
										<p className="wrap-break-word">{m.text}</p>
										<p className="text-[8px] text-gray-200 text-right">
											{formatTime(m.createdAt)}
										</p>
									</div>
								</motion.div>
							);
						})}
				</div>
				<div ref={messageBoxEndRef} />
			</div>

			<AnimatePresence>
				{showAiSuggestions && messages.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="shrink-0 overflow-hidden border-t border-zinc-100 bg-white"
					>
						<div className="px-4 pt-3 pb-2">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-1.5">
									<IoSparkles
										size={12}
										className="text-violet-500"
									/>
									<span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
										AI Suggestions
									</span>
								</div>
								<button onClick={() => setShowAiSuggestions(false)}>
									<FaX
										size={14}
										className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
									/>
								</button>
							</div>
							{suggestionLoading ? (
								<div className="flex flex-col gap-1.5">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="h-9 bg-zinc-100 rounded-xl animate-pulse"
										/>
									))}
								</div>
							) : (
								<div className="flex flex-col gap-1.5">
									{suggestions.map((s, i) => (
										<motion.div
											key={i}
											whileTap={{ scale: 0.98 }}
											onClick={async () => {
												setText(s);
												await sendMessage();
											}}
											className="text-left text-sm text-zinc-700 bg-zinc-50 hover:bg-violet-50 hover:text-violet-700 border border-zinc-100 hover:border-violet-200 px-3 py-2 rounded-xl transition-all cursor-pointer"
										>
											{s}
										</motion.div>
									))}
									<button
										onClick={getAiSuggestions}
										className="text-[11px] text-violet-500 hover:text-violet-700 font-semibold text-center mt-1 transition-colors cursor-pointer"
									>
										Refresh Suggestions
									</button>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<div className="shrink-0 px-4 pb-4 pt-2 bg-white">
				<div className="flex items-center gap-2 bg-zinc-100 rounded-2xl pl-3 pr-1.5 py-1.5">
					{messages.length > 0 && (
						<motion.button
							whileTap={{ scale: 0.95 }}
							onClick={() => getAiSuggestions()}
							className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
								showAiSuggestions
									? "bg-violet-600 text-white"
									: "bg-white text-violet-500 hover:bg-violet-50 border border-zinc-200"
							}`}
						>
							<IoSparkles size={14} />
						</motion.button>
					)}
					<input
						type="text"
						value={text}
						placeholder="Message..."
						onChange={(e) => setText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								sendMessage();
							}
						}}
						className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-1.5 min-w-0"
					/>
					<motion.button
						whileTap={{ scale: 0.88 }}
						onClick={() => sendMessage()}
						disabled={!text.trim()}
						className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
							text.trim()
								? "bg-zinc-950 text-white hover:bg-zinc-800"
								: "bg-transparent text-zinc-300 cursor-not-allowed"
						}`}
					>
						<FiSend size={14} />
					</motion.button>
				</div>
			</div>
		</div>
	);
};

export default RideChat;
