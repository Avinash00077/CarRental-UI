import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CalendarCheck, Car, Star, User, BookAIcon, LoaderCircle, CarFrontIcon } from "lucide-react";
import { useScreenSize } from "../../context/screenSizeContext";

const SideBar = ({ setIsSidebarHovered }) => {
  let menuItems
    const adminAuthToken = localStorage.getItem("adminAuthToken")
    if (adminAuthToken) {
      const adminDetails = localStorage.getItem("adminDetails");
      const {user_type} = JSON.parse(adminDetails);
      menuItems = [
        { route: "/admin/car-upload", label: "Car Upload", icon: Car },
        { route: "/admin/bookings", label: "Bookings", icon: BookAIcon },
      ];
      if(user_type === 'super_user'){
        menuItems.push({ route: "/admin/user-verification", label: "User Verfication", icon: User })
        menuItems.push({ route: "/admin/locations", label: "Locations", icon: LoaderCircle })
        menuItems.push({ route: "/admin/cars-brands", label: "Car Brands", icon: CarFrontIcon })
      }
    }else{
 menuItems = [
  { route: "/", label: "Home", icon: Home },
  { route: "/bookings", label: "Bookings", icon: CalendarCheck },
  { route: "/viewCars", label: "Ride", icon: Car },
  //{ route: "/reviews", label: "Reviews", icon: Star },
  { route: "/userProfile", label: "Profile", icon: User },
];
    }
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  console.log(location.pathname == "/viewCars", " loaction is ");
  const [isHovered, setIsHovered] = useState(false);
  const { isScreenSmall } = useScreenSize();

  const handleScroll = (route) => {
    setActiveMenu(route);
  };

  console.log(activeMenu, "ActiveMenu is Hello");

  return (
    <>
      {!isScreenSmall && (
        <div
          className="h-screen bg-[#121212] shadow-lg transition-all duration-300 flex flex-col"
          style={{
            width:
              isHovered && location.pathname != "/viewCars" ? "200px" : "64px",
            marginTop: ".8%",
            padding: "10px",
            marginRight: "15px",
          }}
          onMouseEnter={() => {
            if (location.pathname != "/viewCars") {
              setIsHovered(true);
              setIsSidebarHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (location.pathname != "/viewCars") {
              setIsHovered(false);
              setIsSidebarHovered(false);
            }
          }}
        >
          <ul
            className="mt-6 space-y-3"
            style={{
              width:
                isHovered && location.pathname != "/viewCars"
                  ? "170px"
                  : "40px",
            }}
          >
            {menuItems.map(({ route, label, icon: Icon }) => (
              <li key={route}>
                <Link
                  to={route}
                  className={`flex items-center gap-3 text-[17px] font-medium cursor-pointer p-3 w-full transition-all duration-300 rounded-lg ${
                    activeMenu === route
                      ? "bg-white text-[#121212] shadow-md scale-[1.05]"
                      : "text-white"
                  } hover:bg-gray-300 hover:scale-[1.05] hover:shadow-md`}
                  style={{ padding: "10px", marginTop: "10px" }}
                  onClick={() => handleScroll(route)}
                >
                  <Icon size={20} />
                  {isHovered && location.pathname != "/viewCars" && (
                    <span>{label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isScreenSmall && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-[#121212] shadow-md  flex justify-around py-2 z-999"
          style={{ padding: "10px 0px" }}
        >
          {menuItems.map(({ route, label, icon: Icon }) => (
            <Link
              key={route}
              to={route}
              className={`flex flex-col items-center text-xs ${
                activeMenu === route ? "text-white" : "text-gray-600"
              }`}
              onClick={() => setActiveMenu(route)}
            >
              <Icon size={24} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default SideBar;
