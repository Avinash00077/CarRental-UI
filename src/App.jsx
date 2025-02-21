import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./components/auth/auth";
import CarsDisplay from "./components/CarsDisplay/CarsDisplay";
import AdminAuth from "./components/admin/AdminAuth";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import { useScreenSize } from "../src/context/screenSizeContext";
import SideBar from "./components/SideBar";
import MyBookings from "./components/MyBookings";
import PaymentPage from "./components/PaymentPage/PaymentPage";
import UserProfile from "./components/UserProfile";
import AdminCarUpload from "./components/admin/cars/car-upload-edit";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const { isScreenSmall } = useScreenSize();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
    const adminAuthToken = localStorage.getItem("adminAuthToken")
    if (adminAuthToken) {
      setIsAdminLogin(true);
    }
  }, []);

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      {(isLogin || isAdminLogin) && (
        <div className="fixed" style={{ marginTop: "4%" }}>
          <SideBar setIsSidebarHovered={setIsSidebarHovered} />{" "}
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          ...(!isScreenSmall
            ? isLogin
              ? isSidebarHovered
                ? { marginLeft: "14%" }
                : { marginLeft: "5%" }
              : { marginLeft: "0%", padding: "00px" }
            : { marginLeft: "0%", padding: "0px" }),
          ...(!isScreenSmall && { fontSize: "14px", padding: "0px" }),
        }}
        className={`transition-all duration-300  ${
          isScreenSmall && "w-full"
        } p-4 ${
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
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/admin/car-upload" element={<AdminCarUpload />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
