import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { useEffect, useState } from "react";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
   const [isLogin,setIsLogin] = useState(false)

  return (
    <div className="w-full min-h-screen ">
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
