import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./components/auth/auth";
import CarsDisplay from "./components/CarsDisplay/CarsDisplay";
import $ from "jquery";
// import Cart from './pages/Cart/Cart'
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import SideBar from "./components/sideBar";
import MyBookings from "./components/MyBookings";
import PaymentPage from "./components/PaymentPage/PaymentPage";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
  }, []);
  return (
    <div className="" id="mainHome">
      <Navbar />
      <div>
        <div>
          {isLogin && (
            <div className="fixed w-2/12 bg-pink-400">
              <SideBar />
            </div>
          )}
        </div>
        <div
          className={`${isLogin ? "w-[85%]" : "w-full"}`}
          style={isLogin ? { marginLeft: "14%" } : undefined}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path='/cart' element={<Cart />} /> */}
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/viewCars" element={<CarsDisplay />} />
            <Route path="/myBookings" element={<MyBookings />} />
            <Route path="/booking" element={<PaymentPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
