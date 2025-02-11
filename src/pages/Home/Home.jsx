import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import About from "../../components/About/About";
import CarsDisplay from "../../components/CarsDisplay/CarsDisplay";
import Ride from "../../components/Ride/Ride";
import Reviews from "../../components/Reviews/Reviews";
import Contact from "../../components/Contact/Contact";
//import SideBar from "../../components/sideBar";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
  }, []);
  return (
    <div className="w-full">
      <div className="flex w-full" style={{ marginTop: "1%" }}>
        <div
          className={`${isLogin ? "w-full" : "w-full"}`}
          style={isLogin ? { marginLeft: "0%" } : undefined}
        >
          <Header />
          <About />
          {/* <CarsDisplay  /> */}
          <Ride />
          <Reviews />
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
