import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const  userDetails= localStorage.getItem("userDetails");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const { email } = JSON.parse(userDetails);
      setUserName(email.split('@')[0]);
    }
  }, []);

  const handleLogin = (type) => {
    console.log(type, " What is tyep here");
    type === "signup"? navigate("/auth", { state: { isLogin: false } }) :navigate("/auth", { state: { isLogin: true } });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails");
    setUserName(null);
    alert("You have been logged out.");
    navigate("/");
    location.reload()
  };
  const handleMenu= (item)=>{
    console.log(item)
    setMenu(item)
    document.getElementById(item)?.scrollIntoView({ behavior: "smooth" });
  } 

  return (
    <div
      className="navbar flex items-center justify-between bg-gray-50 fixed top-0 left-0 right-0 z-50"
      style={{ padding: "5px 15px" }}
    >
      <div className="logo">
        <img
          src="https://ideogram.ai/assets/image/lossless/response/QhwppK8wRL66uMwS4nY1ZQ"
          className="w-44 h-[60px] p-24"
          alt="logo"
        />
      </div>
      <div>
        {!(userName || userDetails?.admin_id) && (   <ul className="navbar-menu flex gap-8">
          {["Home", "About-Us", "Book-A-Car", "Ride", "Reviews"].map((item) => (
            <li
              key={item}  
              onClick={() => handleMenu(item)}
              className={`cursor-pointer text-[17px] font-[500] transition-all duration-300 ${
                menu === item
                  ? "text-[#4a4a8c] border-b-3 font-semibold border-[#4a4a73] pb-[10px]"
                  : "text-[#4a4a8c]"
              } hover:text-[#4a4a73] hover:border-b-3 hover:border-[#4a4a73] hover:pb-4`}
            >
              {item}
            </li>
          ))}
        </ul>)}

      </div>
      <div className="navbar-right flex items-center">
        {userName ? (
          <div className="flex items-center gap-4">
            <span className="text-[15px] font-medium text-gray-800">
               {userName}
            </span>
            <button
              onClick={handleLogout}
              className="mx-2 text-white p-2 text-[15px] h-10 w-24 border-[3px] bg-[#6f82c6] font-medium border-[#6f82c6] rounded-full hover:bg-gray-100 hover:text-black hover:border-[#6f82c6] transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={()=>handleLogin("login")}
              className="mx-2 text-white p-2 text-[15px] h-10 w-24 border-[3px] bg-[#6f82c6] font-medium border-[#6f82c6] rounded-full hover:bg-gray-100 hover:text-black hover:border-[#6f82c6] transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
              style={{marginRight: "10px"}}
            >
              Login
            </button>
            <button 
            onClick={()=>handleLogin("signup")}
            className="mx-2 text-white p-2 text-[15px] h-10 w-24 border-[3px] bg-[#6f82c6] font-medium border-[#6f82c6] rounded-full hover:bg-gray-100 hover:text-black hover:border-[#6f82c6] transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
              Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
