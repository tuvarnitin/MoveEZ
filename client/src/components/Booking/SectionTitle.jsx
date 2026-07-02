import React from "react";

const SectionTitle = ({step,title}) => {
	return (
		<div className="flex items-center gap-2 mb-3">
			<div className="w-5 h-5 rounded-full bg-background flex items-center justify-center shrink-0">
				<span className="text-white text-[9px] font-black">{step}</span>
			</div>
			<p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
				{title}
			</p>
		</div>
	);
};

export default SectionTitle;
