import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Auth from "./components/auth/auth";
import RideCars from "./components/RideCars";
import CarsDisplay from "./components/CarsDisplay/CarsDisplay";
import AdminAuth from "./components/admin/AdminAuth";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import { useScreenSize } from "../src/context/screenSizeContext";
import { useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import MyBookings from "./components/MyBookings";
import PaymentPage from "./components/PaymentPage/PaymentPage";
import UserProfile from "./components/UserProfile";
import AdminCarUpload from "./components/admin/cars/car-upload-edit";
import UserVerification from "./components/admin/user/UserVerfication";
import CurrentBookings from "./components/admin/bookings/CurrentBookings";
import BookRide from "./components/bookingRide";
import Locations from "./components/admin/location/Locations";
import CarBrands from "./components/admin/cars/CarBrands";
import Admins from "./components/admin/admins/AdminUsers";
//import AdminRoute from "./routes/adminRoute";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const { isScreenSmall } = useScreenSize();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location, " Location value is ");
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
    const adminAuthToken = localStorage.getItem("adminAuthToken");
    if (adminAuthToken) {
      setIsAdminLogin(true);
      if (location.pathname === "/") {
        navigate("/admin/bookings");
      }
    } else {
      localStorage.removeItem("adminAuthToken");
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {(isLogin || isAdminLogin) && (
        <div className="fixed" style={{ marginTop: "4%" }}>
          <SideBar setIsSidebarHovered={setIsSidebarHovered} />
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
        className={`transition-all duration-300 ${
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
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/booking" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/rides" element={<RideCars />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/BookRide" element={<BookRide />} />

          {/* <Route element={<AdminRoute isAdminLogin={isAdminLogin} />}> */}
          <Route path="/admin/car-upload" element={<AdminCarUpload />} />
          <Route
            path="/admin/user-verification"
            element={<UserVerification />}
          />
          <Route path="/admin/bookings" element={<CurrentBookings />} />
          <Route path="/admin/locations" element={<Locations />} />
          <Route path="/admin/cars-brands" element={<CarBrands />} />
          <Route path="/admin/admin-users" element={<Admins />} />
          {/* </Route> */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
