import React from "react";
import GoogleIcon from "../GoogleIcon";
import { Button } from "../../components/index.js";

const Google = () => {
	const BACKEND_URL = import.meta.env.VITE_API_BACKEND_URL;

	return (
		<>
			<Button
				onClick={() => window.open(`${BACKEND_URL}/api/auth/google`, "_self")}
				text={`Continue with Google`}
				icon={<GoogleIcon />}
			/>
		</>
	);
};

export default Google;
