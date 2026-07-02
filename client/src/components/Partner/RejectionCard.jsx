import React from "react";

import { FiAlertTriangle } from "../../assets/icons/index.js";

import { Button } from "../../components/index.js";

const RejectionCard = ({ title, actionLabel, reason, onAction }) => {
	return (
		<div className="bg-red-50 border border-red-200 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 space-y-4">
			<div className="flex items-center gap-2 text-red-600 font-semibold text-sm sm:text-base">
				<FiAlertTriangle />
				{title}
			</div>
			<div className="bg-white border rounded-xl p-4 text-sm sm:text-base">
				{reason}
			</div>
			{onAction && (
				<Button
					text={actionLabel}
					onClick={onAction}
					fill={true}
					className="text-[100px]"
					style={{ width: "max-content" }}
				/>
			)}
		</div>
	);
};

export default RejectionCard;
