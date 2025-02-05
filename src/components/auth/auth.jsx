import React, { useState,useEffect } from "react";
import axios from "axios";
import constants from "../../config/constants";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("Hello, World!");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "sudheerjanga9999@gmail.com",
    password: "sudheer123",
    phone: "",
    confirmPassword: "",
  });
  console.log(constants.API_BASE_URL);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
        setIsModalOpen(true);
        setIsLoaderOpen(false)
        setModalMessage("Please enter a valid email and password.");
        setModalType("failure");
      return;
    }

    if (
      !isLogin &&
      (!formData.firstName || !formData.lastName || !formData.confirmPassword)
    ) {
        setIsModalOpen(true);
        setIsLoaderOpen(false)
        setModalType("failure");
        setModalMessage("Please complete all sign-up fields.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
        setIsModalOpen(true);
        setIsLoaderOpen(false)
        setModalType("failure");
        setModalMessage("Passwords do not match.");
      return;
    }

    if (isLogin) {
        setIsLoaderOpen(true);
      try {
        const response = await axios.get(
          `${constants.API_BASE_URL}/user/auth`,
          {
            headers: {
              email: formData.email,
              password: formData.password,
            },
          }
        );

        console.log("Login successful", response.data);
        const { token, userDetails } = response.data.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        setIsLoaderOpen(false);
        setIsModalOpen(true);
        setModalType("success");
        setModalMessage("Login successful!");
        setTimeout(() => {
            window.location.href = "/";
        },2000)
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        setIsModalOpen(true);
        setIsLoaderOpen(false)
        setModalType("failure");
        setModalMessage("Login failed. Please check your credentials.");
        setFormData({ ...formData, password: "",email: "" });
      }
    }

    // Handling sign up
    else {
      console.log("Signing up with", formData);
      setIsLoaderOpen(true);
      try {
        const response = await axios.post(
          `${constants.API_BASE_URL}/user/add`,
          {
            name: formData.firstName + " " + formData.lastName,
            email: formData.email,
            phone_number: formData.phone,
            password: formData.password,
          }
        );
        console.log("Signup successful", response.data);
        setIsLoaderOpen(false);
        setIsModalOpen(true);
        setModalType("success");
        setModalMessage("SignUp successful! Welcome, ");
        // Handle signup success (e.g., redirect to login, show success message, etc.)
      } catch (error) {
        console.error("Signup failed", error);
        setIsModalOpen(true);
        setIsLoaderOpen(false);
        setModalType("failure");
        setModalMessage("Signup failed. Please try again later.");
      }
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    isLoaderOpen(false)
    };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-r from-[#7c94e1] to-[#dadff5] bg-opacity-70 flex items-center justify-center z-20"
      style={{
        backgroundImage:
          "url('https://ideogram.ai/assets/image/lossless/response/dcXzY0mIS8uKgte_QClBvQ')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

        ({isModalOpen && <Modal
        typeOfModal={modalType}
        message={modalMessage}
        closeModal={closeModal}/>})

        ({isLoaderOpen && <Loader message="Loading..." />})
        
      <div className="bg-white dark:bg-neutral-950 relative rounded-lg shadow-2xl w-full h-auto mx-4 md:mx-0 md:max-w-[55%]">
        <div className="flex flex-col md:flex-row rounded-lg shadow-lg">
          {/* Image Section */}
          <div className="w-6/12 h-[530px] flex items-center justify-center rounded-lg">
            <img
              src="https://ideogram.ai/assets/progressive-image/balanced/response/FvlMM4_uTDa0H7qBYbjcSQ"
              alt="Doctor"
              className="rounded-tl-lg rounded-bl-lg w-full h-full object-cover"
            />
          </div>
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              height: "510px",
              width: "50%",
              borderRadius: "0.5rem",
            }}
          >
            <div className="flex justify-end "> 
              <span
                onClick={() => navigate("/")}
                className="text-xl cursor-pointer text-gray-500 hover:text-gray-800"
              >
                ✖
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center" style={isLogin ? { marginTop: "60px" } : {}}>
              {isLogin ? "Welcome Back!" : "Join Us!"}
            </h2>
            <p className="text-center text-sm text-gray-500 mb-4">
              {isLogin
                ? "Log in to your account to continue."
                : "Create a new account to get started."}
            </p>
            {!isLogin && (
              <div className="flex space-x-4">
                <div className="w-1/2 " style={{marginRight:"10px"}}>
                  <label className="block text-sm mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter First Name"
                    className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                    style={{ padding: "8px", margin: "4px 0px" }}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter Last Name"
                    className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                    style={{ padding: "8px", margin: "4px 0px" }}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Type your email"
                className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                style={{ padding: "8px", margin: "4px 0px" }}
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Your Phone Number"
                  className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                  style={{ padding: "8px", margin: "4px 0px" }}
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Type your password"
                className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                style={{ padding: "8px", margin: "4px 0px" }}
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                  style={{ padding: "8px", margin: "4px 0px" }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 cursor-pointer hover:text-blue-400 mb-4">
              {isLogin ? "Forgot your password?" : ""}
            </p>
            <button
              style={{ padding: "8px", margin: "10px 0px" }}
              type="submit"
              className="bg-[#6e81c7] hover:bg-[#5a6aa1] text-medium py-2 px-5 rounded-full text-white shadow-lg transition-colors duration-300"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
            <p
              onClick={() => setIsLogin(!isLogin)}
              className="text-center text-medium text-gray-600 cursor-pointer hover:text-blue-400 mt-4"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
