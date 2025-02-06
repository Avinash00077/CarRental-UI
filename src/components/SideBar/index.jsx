import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Info,
  Calendar,
  Car,
  Star,
  CalendarCheck,
  LogOut,
} from "lucide-react";

const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const location = useLocation();
  const navigate = useNavigate();

  // Store menu items in state
  const [menuItems, setMenuItems] = useState([
    { name: "Home", path: "#mainHome", icon: <Home size={20} /> },
    { name: "Bookings", path: "#bookings", icon: <CalendarCheck size={20} /> },
    { name: "Ride", path: "#ride", icon: <Car size={20} /> },
    { name: "Reviews", path: "#reviews", icon: <Star size={20} /> },
    { name: "About Us", path: "#about", icon: <Info size={20} /> },
    { name: "Logout", path: "/logout", icon: <LogOut size={20} /> },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails");
    alert("You have been logged out.");
    window.location.href = "/"; // Redirect
  };

  const handleScroll = (targetId, name) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/viewCars") {
      console.log("Adding 'Book A Car' to menu");
      setMenuItems((prevItems) => {
        // Prevent duplicate "Book A Car" entries
        if (!prevItems.some((item) => item.name === "Book A Car")) {
          return [
            prevItems[0], // Keep "Home" at index 0
            {
              name: "Book A Car",
              path: "#book-a-car",
              icon: <Calendar size={20} />,
            },
            ...prevItems.slice(1), // Append the rest
          ];
        }
        return prevItems;
      });
      setActiveMenu("Book A Car");
    }
  }, [location]);

  return (
    <div
      className="w-48 h-screen bg-gray-100 text-gray-900 p-5 fixed left-0 top-0 shadow-md"
      style={{ marginTop: "4%", padding: "10px" }}
    >
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index} className="mt-2" style={{ marginTop: "17px" }}>
            <Link
              to={
                item.name === "Bookings"
                  ? "/myBookings"
                  : item.name !== "Logout"
                  ? "/"
                  : "/"
              }
              onClick={() => {
                if (item.name !== "Logout") {
                  setActiveMenu(item.name);
                  handleScroll(item.path.slice(1), item.name);
                } else {
                  handleLogout();
                }
              }}
              className={`flex items-center gap-3 text-[17px] font-[500] cursor-pointer p-3 transition-all duration-300 rounded-lg ${
                activeMenu === item.name
                  ? "bg-[#6f82c6] text-white shadow-md scale-[1.05]"
                  : "text-[#4a4a8c]"
              }  hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
              style={{ padding: "4px 10px" }}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
