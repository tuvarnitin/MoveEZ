import { Route, Routes } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

import {authService} from "./services/auth.service.js"

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
   const [isLogin,setIsLogin] = useState(false)
   const [isLoading,setIsLoading] = useState(true)

   useLayoutEffect(()=>{
    (
      async () => {
       try {
         const response = await authService.getMe()
         if (response.success) {
           setIsLogin(true)
           setIsLoading(false)
         }
        } catch (error) {
         setIsLogin(false)
        setIsLoading(false)
       }
      }
    )()
   },[])

  return (
    <div className={`w-full min-h-screen`}>
      {/* Loader */}
      {
        isLoading && <div className={`fixed inset-0 w-screen grid place-items-center h-screen z-10 backdrop-blur-sm`}>
          <div className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin border-white"></div>
        </div>
      }
      <Navbar isLogin={isLogin} setIsAuthModalOpen={setIsAuthModalOpen} />
      {
        isAuthModalOpen  && <AuthModal isLogin={isLogin} setIsLogin={setIsLogin} setIsAuthModalOpen={setIsAuthModalOpen} />
      }
      <Routes>
        <Route path="/" element={<Home isLogin={isLogin} setIsAuthModalOpen={setIsAuthModalOpen} />} />
      </Routes>
    </div>
  );
}

export default App
