import { Route, Routes } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";

import { AnimatePresence } from "motion/react";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AuthModal from "./components/auth/AuthModal.jsx";

import { authService } from "./services/auth.service.js"

import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, onLogout } from "./redux/features/authSlice.js";
import SideBar from "./components/SideBar.jsx";
import Login from "./components/auth/Login.jsx";
import BecomePartner from "./pages/BecomePartner.jsx";
import AuthCheckerRoute from "./components/protectedRoutes/AuthCheckerRoute.jsx";
import { clearUserData, setUserData } from "./redux/features/userSlice.js";
import VehicleDetails from "./components/VehicleDetails.jsx";
import UploadDocuments from "./components/UploadDocuments.jsx";
import BankingInfo from "./components/BankingInfo.jsx";
import PartnerPage from "./pages/PartnerPage.jsx";
import PartnerDashboard from "./pages/PartnerDashboard.jsx";
import Footer from "./components/Footer.jsx";
import RoleChecker from "./components/protectedRoutes/RoleChecker.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {

  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const getUser = async () => {
      try {
        try {
          await authService.refresh()
        } catch (e) {
        }

        const response = await authService.getMe()
        if (response.success) {
          dispatch(loginSuccess())
          dispatch(setUserData({
            user: response.user
          }))
        }
      } catch (error) {
        dispatch(onLogout({}))
        dispatch(clearUserData())
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isAuthModalOpen = useSelector(state => state.auth.isAuthModalOpen)
  const user = useSelector(state => state.user)

  if (isLoading) {
    return <div className={`fixed inset-0 w-screen grid place-items-center h-screen z-10 backdrop-blur-sm`}>
      <div className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin border-white"></div>
    </div>
  }

  return (
    <div className={`w-full min-h-screen bg-background`}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && <SideBar setIsSidebarOpen={setIsSidebarOpen} />}
      </AnimatePresence>
      {/* Auth modal */}
      <AnimatePresence>
        {
          isAuthModalOpen && <AuthModal />
        }
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home setIsSidebarOpen={setIsSidebarOpen} />} />
        <Route path="/auth" element={<AuthModal />} />
        <Route element={<AuthCheckerRoute />}>
          <Route path="/partner/become-partner" element={<BecomePartner />}>
            <Route index element={<VehicleDetails />} />
            <Route path="upload-documents" element={<UploadDocuments />} />
            <Route path="bank-details" element={<BankingInfo />} />
          </Route>
          <Route element={<RoleChecker />}>
            <Route path="/partner" element={<PartnerPage />}>
              <Route index element={<PartnerDashboard />} />
              <Route path="dashboard" element={<PartnerDashboard />} />
            </Route>
          </Route>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
