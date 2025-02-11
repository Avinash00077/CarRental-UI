import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Info, CalendarCheck, Car, Star, LogOut,User  } from "lucide-react";

const SideBar = ({ setIsSidebarHovered }) => {
  const location = useLocation(); // ✅ Detects the current URL path
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [isHovered, setIsHovered] = useState(false);
  const handleScroll = (route, targetId) => {
    setActiveMenu(route);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="h-screen bg-gray-100 shadow-lg transition-all duration-300 flex flex-col"
      style={{
        width: isHovered ? "200px" : "64px",
        marginTop: ".8%",
        padding: "10px",
        marginRight: "15px",
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsSidebarHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsSidebarHovered(false);
      }}
    >
      <ul
        className="mt-6 space-y-3"
        style={{ width: isHovered ? "170px" : "40px" }}
      >
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
              activeMenu === "/"
                ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                : "text-[#4a4a8c]"
            } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => handleScroll("/", "about")}
          >
            <Home size={20} />
            {isHovered && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
              activeMenu === "/bookings"
                ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                : "text-[#4a4a8c]"
            } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => handleScroll("/bookings", "about")}
          >
            <CalendarCheck size={20} />
            {isHovered && <span>Bookings</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
              activeMenu === "/ride"
                ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                : "text-[#4a4a8c]"
            } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => handleScroll("/ride", "ride")}
          >
            <Car size={20} />
            {isHovered && <span>Ride</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
              activeMenu === "/reviews"
                ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                : "text-[#4a4a8c]"
            } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => handleScroll("/reviews", "reviews")}
          >
            <Star size={20} />
            {isHovered && <span>Reviews</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
              activeMenu === "/about"
                ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                : "text-[#4a4a8c]"
            } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => handleScroll("/about", "about")}
          >
            <Info size={20} />
            {isHovered && <span>About Us</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/userProfile"
            className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
              activeMenu === "/userProfile"
                ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                : "text-[#4a4a8c]"
            } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => handleScroll("/userProfile", "userProfile")}
          >
            <User size={20} />
            {isHovered && <span>My Profile</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className="flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg text-red-500 hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md"
            style={{ padding: "10px", marginTop: "10px" }}
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userDetails");
              alert("You have been logged out.");
              window.location.href = "/";
            }}
          >
            <LogOut size={20} />
            {isHovered && <span>Logout</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
