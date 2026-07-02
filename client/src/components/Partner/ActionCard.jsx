import React from "react";

import { Button } from "../../components/index.js";

const ActionCard = ({ icon: Icon, button, onClick, title }) => {
	return (
		<div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg flex border flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
			<div className="w-full flex items-center gap-4">
				<div className="bg-background text-white p-4 md:p-4 rounded-xl shrink-0">
					{<Icon />}
				</div>
				<div className="text-base sm:text-lg md:text-xl font-semibold">
					{title}
				</div>
			</div>
			<Button
				text={button}
				fill={true}
				onClick={onClick}
				style={{ width: "min-content" }}
			/>
		</div>
	);
};

export default ActionCard;
