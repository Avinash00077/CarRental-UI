import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import constants from "../../config/constants";
import debounce from "lodash.debounce";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { useScreenSize } from "../../context/screenSizeContext";
import { useWindowSize } from "react-use";
import arrow from "../../assets/arrow.png";
import Loader from "../Loader/Loader";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import available from "../../assets/available.png";
import not_available from "../../assets/not_available.png";
import { formatDateToYYYYMMDD2 } from "../../utils/dateUtils";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [ispasswordReset, setPasswordReset] = useState(false);
  const [isUserAvailable, setUserAvailable] = useState("none");
  const [authStatus, setAuthStatus] = useState("auth");
  const [isGetUserName, setIsGetUserName] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Loading...");
  const navigate = useNavigate();
  const location = useLocation();
  const { isScreenSmall } = useScreenSize();
  console.log(isScreenSmall, " Is small scren value is");
  useEffect(() => {
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]);
  // const [formData, setFormData] = useState({
  //   userName: "lokeshreddy",
  //   firstName: "avinash",
  //   lastName: "tummuri",
  //   email: "reddyjlokesh@gmail.com",
  //   password: "lokesh@0508",
  //   phone: "6303896539",
  //   confirmPassword: "Avinash77",
  //   gender: "",
  //   dob: "",
  // });

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
    gender: "",
    dob: "",
  });

  const [resetformData, setResetFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  console.log(constants.API_BASE_URL);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({ ...formData, [name]: value });
  };
  const handleRestInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, " Hello I am here ");
    setResetFormData({ ...resetformData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.password) {
      setIsModalOpen(true);
      setIsLoaderOpen(false);
      setModalMessage("Please enter a valid username and password.");
      setModalType("failure");
      return;
    }

    if (
      !isLogin &&
      (!formData.firstName || !formData.lastName || !formData.confirmPassword)
    ) {
      setIsModalOpen(true);
      setIsLoaderOpen(false);
      setModalType("failure");
      setModalMessage("Please complete all sign-up fields.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setIsModalOpen(true);
      setIsLoaderOpen(false);
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
              user_name: formData.userName,
              password: formData.password,
            },
          }
        );
        setShowConfetti(true);
        console.log("Login successful", response.data);
        const { token, userDetails } = response.data.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        const storedDates = localStorage.getItem("initialSelectedDate");
        if (storedDates) {
          setIsLoaderOpen(false);
          setIsModalOpen(true);
          setModalType("success");
          setModalMessage("Login successful!");
          const { pickUpDate, dropOffDate,dropOffTime,pickUpTime ,selectedLocation} = JSON.parse(storedDates);
          setTimeout(()=>{
            navigate(
              `/viewCars?pickUpDate=${pickUpDate}&toDate=${dropOffDate}&location=${selectedLocation}&pickupTime=${pickUpTime}&dropoffTime=${dropOffTime}`
            );
          },4000)
          
        } else {
          console.log("No dates found in localStorage.");
          setIsLoaderOpen(false);
          setIsModalOpen(true);
          setModalType("success");
          setModalMessage("Login successful!");
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        }
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        setIsModalOpen(true);
        setIsLoaderOpen(false);
        setModalType("failure");
        setModalMessage(
          error?.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
        setFormData({ ...formData, password: "", email: "" });
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
            user_name: formData.userName,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phone,
            password: formData.password,
            dob: DOBFormat(formData.dob),
            gender: formData.gender,
          }
        );
        setShowConfetti(true);
        console.log("Signup successful", response.data);
        setIsLoaderOpen(false);
        setIsModalOpen(true);
        setModalType("success");
        const { token, userDetails } = response.data.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        setModalMessage("SignUp successful! Welcome, ");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
        // Handle signup success (e.g., redirect to login, show success message, etc.)
      } catch (error) {
        console.error("Signup failed", error);
        console.log(error.response.data.message, " Helo");
        setIsModalOpen(true);
        setIsLoaderOpen(false);
        setModalType("failure");
        setModalMessage(
          error?.response?.data?.message || " Something Went Wrong"
        );
      }
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    isLoaderOpen(false);
  };
  const handleResetPassword = () => {
    setAuthStatus("verifyEmail");
    setPasswordReset(true);
    setOpenResetPassword(false);
  };

  const handleGetUserName = () => {
    setAuthStatus("getUserName");
    setIsGetUserName(true);
    setPasswordReset(true);
    setOpenResetPassword(false);
  };
  const handlesubmitMail = async (e) => {
    e.preventDefault();
    console.log(authStatus);
    setIsLoaderOpen(true);
    if (authStatus === "verifyEmail") {
      setLoaderMessage("Please wait, sending OTP to your email...");

      console.log(formData.email);

      try {
        const response = await axios.get(
          `${constants.API_BASE_URL}/user/password-reset/otp`,
          {
            headers: {
              user_name: formData.userName, // Send email in headers
            },
          }
        );

        if (response.status === 200) {
          setLoaderMessage("OTP sent to your email.");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
          setLoaderMessage(null);
        }
        setAuthStatus("submitPassword");
        setOpenResetPassword(!openResetPassword);
        setIsLoaderOpen(false);
      } catch (error) {
        setLoaderMessage("User not found with given username");
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
        setLoaderMessage(null);

        //setIsModalOpen(true);
        setIsLoaderOpen(false);
        //setModalType("failure");
      }
    }

    if (authStatus === "submitPassword") {
      setLoaderMessage("Resetting password, please wait...");
      console.log(resetformData);

      try {
        const response = await axios.put(
          `${constants.API_BASE_URL}/user/password-reset/confirm`,
          {
            user_name: formData.userName,
            otp: resetformData.otp,
            password: resetformData.password,
          }
        );

        if (response.status === 200) {
          setLoaderMessage("Password reset successful.");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
          setLoaderMessage(null);
        }

        setIsLoaderOpen(false);
        setIsModalOpen(true);
        setModalType("success");
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setIsModalOpen(false);
          setPasswordReset(false);
        }, 2000);
      } catch (error) {
        setLoaderMessage("OTP verification failed.");
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
        setLoaderMessage(null);

        setIsLoaderOpen(false);
        setIsModalOpen(true);
        setModalType("failure");
      }
    }
    console.log("Hello ia m omwne");
    if (authStatus === "getUserName") {
      setLoaderMessage(
        "Please wait, we are sending your username to your email..."
      );

      try {
        const response = await axios.get(
          `${constants.API_BASE_URL}/user/user-name/email`,
          {
            headers: {
              email: formData.email, // Send email in headers
              dob: formatDateToYYYYMMDD2(formData.dob),
            },
          }
        );

        if (response.status === 200) {
          setLoaderMessage("Email sent, please check your inbox.");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
          setLoaderMessage(null);
        }

        setIsGetUserName(false);
        setPasswordReset(false);
        setOpenResetPassword(true);
        setIsLoaderOpen(false);
      } catch (error) {
        setLoaderMessage("User not found with email and dob combination");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 3 seconds
        setLoaderMessage(null);

        setIsGetUserName(true);
        setPasswordReset(true);
        setOpenResetPassword(false);
        setIsLoaderOpen(false);
      }
    }
  };

  const restpasswordBack = () => {
    console.log("Back is clicked");
    if (authStatus === "submitPassword") {
      console.log("Hello chil");
      setAuthStatus("verifyEmail");
      setOpenResetPassword(false);
    } else if (authStatus == "verifyEmail") {
      setPasswordReset(false);
    } else if (authStatus == "getUserName") {
      setPasswordReset(false);
      setIsGetUserName(false);
    }
    // setOpenResetPassword(!openResetPassword)
  };

  const DOBFormat = (date) => {
    const convertDOB = new Date(date);
    const year = convertDOB.getFullYear();
    const month = (convertDOB.getMonth() + 1).toString().padStart(2, "0");
    const day = convertDOB.getDate().toString().padStart(2, "0");
    const formattedDOB = `${year}-${month}-${day}`;
    return formattedDOB;
  };

  const handleDOB = (e) => {
    setFormData({ ...formData, dob: e.target.value });
  };

  const checkUserNameAvailablity = useCallback(
    debounce(async (username) => {
      if (username.lenght > 3) {
        setUserAvailable("none");
        return;
      }
      try {
        console.log("Inside UserName Techen");
        const response = await axios.get(
          `${constants.API_BASE_URL}/user/user-name/availability`,
          {
            headers: {
              user_name: username,
            },
          }
        );
        if (response.data.userNameAvilable) {
          setUserAvailable(true);
        } else {
          setUserAvailable(false);
        }
        console.log(response);
      } catch (error) {
        console.error(error, " Error While Checking UserName ");
      }
    }, 500),
    []
  );
  useEffect(() => {
    checkUserNameAvailablity(formData.userName);
    return () => checkUserNameAvailablity.cancel();
  }, [formData.userName, checkUserNameAvailablity]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20  ">
      {showConfetti && <Confetti width={width} height={height} />}
      {isModalOpen && (
        <Modal
          typeOfModal={modalType}
          message={modalMessage}
          closeModal={closeModal}
        />
      )}
      {isLoaderOpen && <Loader message={loaderMessage} />}
      <div
        className="absolute inset-0 "
        style={{
          // backgroundImage:
          //   "url('https://ideogram.ai/assets/image/lossless/response/dcXzY0mIS8uKgte_QClBvQ')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.5",
        }}
      ></div>
      <div
        className={`relative z-30 ${
          !isScreenSmall && "bg-white"
        }     w-full  mx-4 md:mx-0 ${
          isLogin ? "md:max-w-[57%]  md:max-w-h-[500px]" : "md:max-w-[60%] "
        }`}
        style={
          isScreenSmall
            ? { marginTop: isLogin ? "0px" : "-40px" }
            : { marginTop: "60px" }
        }
      >
        <div
          className={`flex flex-col md:flex-row rounded-lg ${
            !isScreenSmall && "shadow-lg"
          }`}
        >
          {!isScreenSmall && (
            <div
              className={`${isScreenSmall && "hidden"} w-6/12 ${
                isLogin ? "md:max-h-[520px]" : "md:max-h-[620px]"
              }  flex items-center justify-center rounded-lg`}
            >
              <img
                src={
                  isLogin
                    ? "https://ideogram.ai/assets/progressive-image/balanced/response/FvlMM4_uTDa0H7qBYbjcSQ"
                    : "https://ideogram.ai/assets/image/lossless/response/yVHGbZm0T3ed00nPnMCoAQ"
                }
                alt="Doctor"
                className="rounded-tl-lg rounded-bl-lg w-full h-full object-cover"
              />
            </div>
          )}

          {!ispasswordReset ? (
            <div className={`${isScreenSmall ? "w-full" : "w-1/2"} `}>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  height: "510px",
                  borderRadius: "0.5rem",
                }}
              >
                <div className="flex justify-end w-full">
                  <span
                    onClick={() => navigate("/")}
                    className="text-xl cursor-pointer text-gray-500 hover:text-gray-800"
                  >
                    ✖
                  </span>
                </div>
                <h2
                  className="text-lg font-semibold text-gray-800 text-center"
                  style={isLogin ? { marginTop: "60px" } : {}}
                >
                  {isLogin ? "Welcome Back!" : "Join Us!"}
                </h2>
                <p className="text-center text-sm text-gray-500 mb-4">
                  {isLogin
                    ? "Log in to your account to continue."
                    : "Create a new account to get started."}
                </p>
                <div
                  className={` flex  w-full items-center`}
                  style={{ margin: "5px 0px" }}
                >
                  <div className={`${!isLogin ? "w-11/12" : "w-full"}`}>
                    <label className="block text-sm mb-1">UserName</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="Type your UserName"
                      className={`w-full text-sm  ${
                        isScreenSmall
                          ? "border-b-2"
                          : "border bg-white rounded-lg hover:bg-gray-50"
                      }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                      style={{ padding: "8px", margin: "4px 0px" }}
                    />
                  </div>
                  {!isLogin && isUserAvailable != "none" && (
                    <div>
                      <img
                        src={isUserAvailable ? available : not_available}
                        className=" mt-6 w-8 h-8"
                        //style={{ marginTop: "20px", marginLeft: "8px" }}
                      ></img>
                    </div>
                  )}
                </div>
                {!isLogin && (
                  <div className="flex space-x-4">
                    <div className="w-1/2 " style={{ marginRight: "10px" }}>
                      <label className="block text-sm mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter First Name"
                        className={`w-full text-sm  ${
                          isScreenSmall
                            ? "border-b-2"
                            : "border bg-white rounded-lg hover:bg-gray-50"
                        }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
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
                        className={`w-full text-sm  ${
                          isScreenSmall
                            ? "border-b-2"
                            : "border bg-white rounded-lg hover:bg-gray-50"
                        }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                        style={{ padding: "8px", margin: "4px 0px" }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-full flex " style={{ marginTop: "10px" }}>
                  {!isLogin && (
                    <div className={`${isLogin ? "w-full" : "w-1/2"}`}>
                      <label className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Type your email"
                        className={`w-full text-sm  ${
                          isScreenSmall
                            ? "border-b-2"
                            : "border bg-white rounded-lg hover:bg-gray-50"
                        }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                        style={{ padding: "8px", margin: "4px 0px" }}
                      />
                    </div>
                  )}

                  {!isLogin && (
                    <div style={{ marginLeft: "10px" }} className="w-1/2">
                      <label className="block text-sm   mb-1">
                        Phone Number
                      </label>
                      <input
                        type="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter Your Phone Number"
                        className={`w-full text-sm  ${
                          isScreenSmall
                            ? "border-b-2"
                            : "border bg-white rounded-lg hover:bg-gray-50"
                        }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                        style={{ padding: "8px", margin: "4px 0px" }}
                      />
                    </div>
                  )}
                </div>
                {!isLogin && (
                  <div
                    className="w-full flex justify-center items-center"
                    //style={{ marginTop: "10px" }}
                  >
                    <div className="w-1/2">
                      <label className="block text-sm mb-1">
                        Date Of Birth
                      </label>
                      <Calendar
                        value={formData.dob}
                        className={`w-full h-9 text-[12px] border-gray-300 focus:outline-none 
    hover:-translate-y-0.5 hover:h-[38px] hover:text-[15px] 
    ${
      isScreenSmall
        ? "border-b-2"
        : "border bg-transparent rounded-lg hover:bg-gray-50"
    }`}
                        id="buttondisplay"
                        placeholder="Select your DOB"
                        onChange={(e) => handleDOB(e)}
                        //style={{ padding: "1px", backgroundColor: "beige" }}
                        showIcon
                      />
                    </div>
                    <div
                      className="w-1/2"
                      // style={{ marginLeft: "10px" }}
                    >
                      <label className="block text-sm mb-1">Gender</label>
                      <Dropdown
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.value })
                        }
                        options={["Male", "Female", "Other"]}
                        optionLabel="gender"
                        placeholder="select gender"
                        className={`w-full text-sm  ${
                          isScreenSmall
                            ? "border-b-2"
                            : "border bg-white rounded-lg hover:bg-gray-50"
                        }  border-gray-300 h-8 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                        // style={{ paddingLeft: "10px" }}
                      />
                    </div>
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
                    className={`w-full text-sm  ${
                      isScreenSmall
                        ? "border-b-2"
                        : "border bg-white rounded-lg hover:bg-gray-50"
                    }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                    style={{ padding: "8px", margin: "4px 0px" }}
                  />
                </div>
                {!isLogin && (
                  <div>
                    <label className="block text-sm mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={`w-full text-sm  ${
                        isScreenSmall
                          ? "border-b-2"
                          : "border bg-white rounded-lg hover:bg-gray-50"
                      }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                      style={{ padding: "8px", margin: "4px 0px" }}
                    />
                  </div>
                )}
                <div className="flex justify-between">
                  <p
                    className="text-xs text-gray-500 cursor-pointer hover:text-blue-400 mb-4"
                    onClick={() => handleResetPassword()}
                  >
                    {isLogin ? "Forgot your password?" : ""}
                  </p>
                  <p
                    className="text-xs text-gray-500 cursor-pointer hover:text-blue-400 mb-4"
                    onClick={() => handleGetUserName()}
                  >
                    {isLogin ? "Forgot your username?" : ""}
                  </p>
                </div>

                <button
                  style={{ padding: "8px", margin: "10px 0px" }}
                  type="submit"
                  className="bg-[#121212] hover:bg-[#121212] text-medium py-2 px-5 rounded-full text-white shadow-lg transition-colors cursor-pointer duration-300  hover:text-[15px]"
                >
                  {isLogin ? "Log In" : "Sign Up"}
                </button>
                <p
                  onClick={() => setIsLogin(!isLogin)}
                  className={`text-center text-medium ${
                    isScreenSmall ? "text-black" : "text-gray-600"
                  } cursor-pointer hover:text-[#121212] mt-4`}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Log In"}
                </p>
              </form>
            </div>
          ) : (
            <div
              style={{ padding: "10px" }}
              className={`${isScreenSmall ? "w-full" : "w-1/2"}`}
            >
              <p onClick={() => restpasswordBack()} className="cursor-pointer">
                <div className="flex  items-center">
                  {" "}
                  <img src={arrow} className="w-5 h-5" />
                  <span style={{ marginLeft: "5px" }}>Back</span>{" "}
                </div>
              </p>
              <h2
                className="text-lg font-semibold text-gray-800 text-center"
                style={{ marginTop: "60px", marginBottom: "30px" }}
              >
                {isGetUserName
                  ? "Get Your Username !!!"
                  : " Reset Your Password !"}
              </h2>
              <form
                className="flex  w-full"
                style={{ padding: "10px" }}
                onSubmit={handlesubmitMail}
              >
                <div
                  className=" shadow-lg rounded-xl w-full "
                  style={{ padding: "10px" }}
                >
                  {!isGetUserName && (
                    <div
                      className="flex items-center justify-start space-x-1"
                      style={{ marginLeft: "3%", marginBottom: "10px" }}
                    >
                      <label className="text-sm w-24 text-black">
                        UserName:
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        placeholder="Type your user name"
                        className="text-sm  h-10  bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none w-full"
                        disabled={authStatus !== "verifyEmail"}
                      />
                    </div>
                  )}
                  {isGetUserName && (
                    <>
                      <div className={`${isLogin ? "w-full" : "w-1/2"}`}>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Type your email"
                          className={`w-full text-sm  ${
                            isScreenSmall
                              ? "border-b-2"
                              : "border bg-white rounded-lg hover:bg-gray-50"
                          }  border-gray-300  px-2 py-1 focus:outline-none hover:-translate-y-0.5 hover:h-[38px]  hover:text-[15px]`}
                          style={{ padding: "8px", margin: "4px 0px" }}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm mb-1">
                          Date Of Birth
                        </label>
                        <Calendar
                          value={formData.dob}
                          className={`w-full h-9 text-[12px] border-gray-300 focus:outline-none 
    hover:-translate-y-0.5 hover:h-[38px] hover:text-[15px] 
    ${
      isScreenSmall
        ? "border-b-2"
        : "border bg-transparent rounded-lg hover:bg-gray-50"
    }`}
                          id="buttondisplay"
                          placeholder="Select your DOB"
                          onChange={(e) => handleDOB(e)}
                          //style={{ padding: "1px", backgroundColor: "beige" }}
                          showIcon
                        />
                      </div>
                    </>
                  )}
                  {openResetPassword && (
                    <div>
                      <div
                        className="flex items-center justify-start space-x-1"
                        style={{ marginLeft: "3%" }}
                      >
                        <label className="block text-sm mb-1 w-24">
                          Enter Otp
                        </label>
                        <input
                          type="text"
                          name="otp"
                          value={resetformData.otp}
                          onChange={handleRestInputChange}
                          placeholder="Enter Your Otp"
                          className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                          style={{ padding: "8px", margin: "4px 0px" }}
                        />
                      </div>
                      <div
                        className="flex items-center justify-start space-x-1"
                        style={{ marginLeft: "3%" }}
                      >
                        <label className="block text-sm mb-1 w-24">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={resetformData.password}
                          onChange={handleRestInputChange}
                          placeholder="Type your password"
                          className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                          style={{ padding: "8px", margin: "4px 0px" }}
                        />
                      </div>
                      {/* <div
                        className="flex items-center justify-start space-x-1"
                        style={{ marginLeft: "3%" }}
                      >
                        <label className="block text-sm mb-1 w-24">
                          {" "}
                          confirm Password
                        </label>
                        <input
                          type="text"
                          name="confirm password"
                          value={resetformData.confirmPassword}
                          onChange={handleRestInputChange}
                          placeholder="Confirm your password"
                          className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
                          style={{ padding: "8px", margin: "4px 0px" }}
                        />
                      </div> */}
                    </div>
                  )}
                  <button
                    style={{
                      padding: "8px",
                      margin: "10px 0px",
                      marginLeft: "30%",
                      marginTop: "25px",
                    }}
                    type="submit"
                    className="bg-[#121212] w-5/12 hover:bg-[#121212] hover:scale-105 text-medium py-2 px-5 rounded-full text-white  shadow-lg transition-colors duration-300 cursor-pointer"
                  >
                    {authStatus == "verifyEmail" ? "Send Otp" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
