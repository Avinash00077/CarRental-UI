import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/screenSizeContext";
import user from "../../assets/boy.png";
import Modal from "../Modal/Modal";
const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(user);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userDetails = localStorage.getItem("userDetails");
  const adminDetails = localStorage.getItem("adminDetails");
  const [isOpen, setOpen] = useState(false);
  const isScreenSize = useScreenSize().isScreenSmall;
  const currentLocation = useLocation();
  const isAdminPage = currentLocation.pathname.includes("admin") ? true : false;
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const adminAuthToken = localStorage.getItem("adminAuthToken");

    if (authToken && !adminAuthToken) {
      const { user_name, profile_img_url } = JSON.parse(userDetails);
      setUserName(user_name);
      if (profile_img_url) {
        setUserImage(profile_img_url);
      }
    }
    if (!authToken && adminAuthToken) {
      const { name } = JSON.parse(adminDetails);
      setUserName(name);
    }
  }, []);

  const handleLogin = (type) => {
    type === "signup"
      ? navigate("/auth", { state: { isLogin: false } })
      : navigate("/auth", { state: { isLogin: true } });
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("userDetails");
  //   setUserName(null);
  //   alert("You have been logged out.");
  //   navigate("/");
  //   location.reload();
  // };
  const handleLogout = () => {
    console.log("Logout request sent!"); // Replace with actual logout logic
    const adminAuthToken = localStorage.getItem("adminAuthToken");
    if (adminAuthToken) {
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminDetails");
      navigate("/admin");
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      navigate("/");
    }
    setUserName(null);

    location.reload();
    setShowModal(false);
  };
  const handleMenu = (item) => {
    setMenu(item);
    document.getElementById(item)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="navbar flex items-center justify-between bg-[#121212] fixed top-0 left-0 right-0 z-50 w-full h-16"
      //style={{ padding: "5px 15px" }}
    >
      {showModal && (
        <Modal
          typeOfModal="confirmation"
          message="Are you sure you want to log out?"
          closeModal={() => setShowModal(false)}
          onConfirm={handleLogout}
        />
      )}
      <div className="logo ml-8 p-0 text-white text-[18px] hover:cursor-pointer"
      onClick={() => {navigate('/')}}>
        {/* <img
          src="https://ideogram.ai/assets/image/lossless/response/QhwppK8wRL66uMwS4nY1ZQ"
          className={`${
            isScreenSize ? " w-[85px] h-[44px] rounded-md" : "w-30 h-12 pl-5"
          }`}
          alt="logo"
        /> */}
        <span>DND</span>
        <br />
        <span>Rentals</span>
      </div>
      {!isScreenSize && (
        <div>
          {!(userName || userDetails?.admin_id) && !isAdminPage && (
            <ul className="navbar-menu flex gap-8">
              {["Home", "About-Us", "Book-A-Car", "Reviews"].map((item) => (
                <li
                  key={item}
                  onClick={() => handleMenu(item)}
                  className={`cursor-pointer text-[17px] font-[500] transition-all duration-300 ${
                    menu === item
                      ? "text-white border-b-3 font-semibold border-white pb-[3px]"
                      : "text-white"
                  } hover:pb-2`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="navbar-right flex items-center">
        {userName ? (
          <div className="relative pr-3">
            <img
              //src="data:image/jpeg;base64,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"
              src = {userImage}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:shadow-lg"
              onClick={() => setOpen(!isOpen)}
            />

            {isOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                style={{ padding: "10px" }}
              >
                <span
                  className="block text-gray-800 text-[17px] font-medium mb-2"
                  style={{ padding: "7px 0px" }}
                >
                  {userName}
                </span>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full text-white p-2 text-[15px] bg-[#121212] font-medium border-[#121212] rounded-full hover:bg-[#121212] hover:text-white hover:border-[#121212] transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ padding: "7px" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          !isAdminPage && (
            <div className={`${isScreenSize ? "text-[13px]" : "text-[15px]"}`}>
              <button
                onClick={() => handleLogin("login")}
                className={`mx-2 text-white   ${
                  isScreenSize ? "h-8 w-16" : "h-10 w-24"
                } bg-[#121212] font-medium rounded-full hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:bg-[#545454]`}
                //style={{ marginRight: "10px" }}
              >
                Login
              </button>
              <button
                onClick={() => handleLogin("signup")}
                className={`mx-2 text-[#121212]   ${
                  isScreenSize ? "h-8 w-16" : "h-10 w-24"
                } border-[3px] mr-10 bg-white font-medium rounded-full hover:text-[#121212] transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg`}
              >
                Signup
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
