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

function App() {

  const disptach = useDispatch()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authService.getMe()
        if (response.success) {
          disptach(loginSuccess({
            user: response.user
          }))
        }
      } catch (error) {
        disptach(onLogout({}))
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isAuthModalOpen = useSelector(state => state.auth.isAuthModalOpen)

  return (
    <div className={`w-full min-h-screen`}>
      {/* Loader */}
      {
        isLoading && <div className={`fixed inset-0 w-screen grid place-items-center h-screen z-10 backdrop-blur-sm`}>
          <div className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin border-white"></div>
        </div>
      }
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      <AnimatePresence>
        {isSidebarOpen && <SideBar setIsSidebarOpen={setIsSidebarOpen} />}
      </AnimatePresence>
      <AnimatePresence>
        {
          isAuthModalOpen && <AuthModal />
        }
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthModal />} />
      </Routes>
    </div>
  );
}

export default App
