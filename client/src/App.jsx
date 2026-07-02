import { Route, Routes } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";

import { AnimatePresence } from "motion/react";

import {
	Navbar,
	SideBar,
	VehicleDetails,
	UploadDocuments,
	BankingInfo,
	Footer,
} from "./components/index.js";

import { AuthModal, Login } from "./components/auth/index.js";

import {
	AuthCheckerRoute,
	PartnerAuthChecker,
	AdminAuthChecker,
} from "./components/protectedRoutes/index.js";

import { Home, BecomePartner } from "./pages/index.js";
import { Booking, Search } from "./pages/Booking/index.js";

import { PartnerDashboard, PartnerPage } from "./pages/Partner/index.js";

import {
	AdminDashboard,
	AdminReviewPartner,
	AdminReviewVehicle,
} from "./pages/Admin/index.js";

import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, onLogout } from "./redux/features/authSlice.js";
import { clearUserData, setUserData } from "./redux/features/userSlice.js";

import Zego from "./zego/Zego.jsx";

import { authService } from "./services/auth.service.js";

function App() {
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const getUser = async () => {
			try {
				try {
					await authService.refresh();
				} catch (e) {}

				const response = await authService.getMe();
				if (response.success) {
					dispatch(loginSuccess());
					dispatch(
						setUserData({
							user: response.user,
						}),
					);
				}
			} catch (error) {
				dispatch(onLogout({}));
				dispatch(clearUserData());
			} finally {
				setIsLoading(false);
			}
		};
		getUser();
	}, []);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const isAuthModalOpen = useSelector((state) => state.auth.isAuthModalOpen);
	const user = useSelector((state) => state.user);

	if (isLoading) {
		return (
			<div
				className={`fixed inset-0 w-screen grid place-items-center h-screen z-10 backdrop-blur-sm`}
			>
				<div className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin border-white"></div>
			</div>
		);
	}

	return (
		<div className={`w-full min-h-screen bg-background`}>
			{/* Sidebar */}
			<AnimatePresence>
				{isSidebarOpen && <SideBar setIsSidebarOpen={setIsSidebarOpen} />}
			</AnimatePresence>
			{/* Auth modal */}
			<AnimatePresence>{isAuthModalOpen && <AuthModal />}</AnimatePresence>
			<Routes>
				{/* Routes for all visiters */}
				<Route
					path="/"
					element={<Home setIsSidebarOpen={setIsSidebarOpen} />}
				/>
				<Route
					path="/auth"
					element={<AuthModal />}
				/>

				{/* Routes only for authenticated users */}
				<Route element={<AuthCheckerRoute />}>
					<Route
						path="/video-kyc/:roomId"
						element={<Zego />}
					/>
					<Route
						path="/booking"
						element={<Booking />}
					/>
					<Route
						path="/search"
						element={<Search />}
					/>
					<Route
						path="/partner/become-partner"
						element={<BecomePartner />}
					>
						<Route
							index
							element={<VehicleDetails />}
						/>
						<Route
							path="upload-documents"
							element={<UploadDocuments />}
						/>
						<Route
							path="bank-details"
							element={<BankingInfo />}
						/>
					</Route>
				</Route>

				{/* Routes only for authorized partners */}
				<Route element={<PartnerAuthChecker />}>
					<Route
						path="/partner"
						element={<PartnerPage />}
					>
						<Route
							index
							element={<PartnerDashboard />}
						/>
						<Route
							path="dashboard"
							element={<PartnerDashboard />}
						/>
					</Route>
				</Route>

				{/* Routes for authorized admin */}
				<Route element={<AdminAuthChecker />}>
					<Route
						path="/admin"
						element={<AdminDashboard />}
					/>
					<Route
						path="/admin/reviews/partner/:id"
						element={<AdminReviewPartner />}
					/>
					<Route
						path="/admin/reviews/vehicle/:id"
						element={<AdminReviewVehicle />}
					/>
				</Route>
			</Routes>
		</div>
	);
}

export default App;
