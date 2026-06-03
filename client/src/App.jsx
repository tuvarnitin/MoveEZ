import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import { useState } from "react";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <div className="w-full min-h-screen ">
      <Navbar setIsLoginModalOpen={setIsLoginModalOpen} />
      {
        isLoginModalOpen && <LoginModal setIsLoginModalOpen={setIsLoginModalOpen} />
      }
    <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App
