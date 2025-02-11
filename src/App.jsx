import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./components/auth/auth";
import CarsDisplay from "./components/CarsDisplay/CarsDisplay";
import AdminAuth from "./components/admin/AdminAuth";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import SideBar from "./components/SideBar";
import MyBookings from "./components/MyBookings";
import PaymentPage from "./components/PaymentPage/PaymentPage";
import UserProfile from "./components/UserProfile";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false); 

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isLogin && (
        <div className="fixed" style={{marginTop:"4%"}}>
          <SideBar setIsSidebarHovered={setIsSidebarHovered} />{" "}
        </div>
      )}

      {/* Main Content */}
      <div
        style={ isLogin ? isSidebarHovered ? { marginLeft: "14%" } : { marginLeft: "5%" }:{marginLeft:"0%",padding:"10px"}}
        className={`transition-all duration-300 p-4 ${
          isLogin
            ? isSidebarHovered
              ? "ml-[5%] w-[calc(100%-14%)]"
              : "ml-[14%] w-[calc(100%-6%)]"
            : "w-full"
        }`}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/viewCars" element={<CarsDisplay />} />
          <Route path="/myBookings" element={<MyBookings />} />
          <Route path="/booking" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/userProfile" element={<UserProfile/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
