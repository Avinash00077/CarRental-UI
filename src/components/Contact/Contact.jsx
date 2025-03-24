import React, { useState, useEffect } from "react";
import constants from "../../config/constants";
import axios from "axios";
import { Star, JoystickIcon } from "lucide-react";
import { getUserToken } from "../../utils/getToken";
import Modal from "../Modal/Modal";
import { MessageSquare } from "lucide-react";
import Loader from "../Loader/Loader";
import user from "../../assets/boy.png";

const Contact = () => {
  const [openFeedBackForm, setFeedBackForm] = useState(false);
  const [openRequestForm, setOpenRequestForm] = useState(false)
  const [isloader, setIsLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userDetails, setUserDeatils] = useState();
  const [modalType, setModalType] = useState("success");
  const [feedback, setFeedback] = useState({
    user_id: "",
    rating: 0,
    comments: "",
    user_name: "",
    profile_img_url: "",
    first_name: "",
    last_name: "",
  });

  const [requestDetails, setRequestDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    additional_info: "",
  });

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const GetUserFeedback = async () => {
    try {
      const response = await axios.get(
        `${constants.API_BASE_URL}/user/user-feedback`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUserToken()}`,
          },
        }
      );
      if (response.data.data.length > 0) {
        setFeedback(response.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!userDetails) {
      const userDetails = JSON?.parse(localStorage.getItem("userDetails"));
      setUserDeatils(userDetails);
      if (userDetails) {
        setFeedback((prev) => ({
          ...prev,
          user_id: userDetails.user_id,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          user_name: userDetails.user_name,
          profile_img_url: userDetails.profile_img_url || user,
        }));
      }
      if(userDetails){
        setRequestDetails((prev) => ({
          ...prev,
          user_id: userDetails.user_id,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          email: userDetails.email,
          phone: userDetails.phone_number
        })); 
      }
    } else {
      GetUserFeedback();
    }
  }, [userDetails]);
  console.log(userDetails, " Use Deatils are ");

  
  const handleJoinChange = (e) => {
    const { name, value } = e.target;
    setRequestDetails({ ...requestDetails, [name]: value });
  };

  const handleJoinSubmit = () => {
    console.log("Submitted Request:", requestDetails);
    setFeedBackForm(false);
  };

  const handleSubmit = async (e) => {
    setIsLoader(true);
    e.preventDefault();
    try {
      if (!feedback.feedback_id) {
        const response = await axios.post(
          `${constants.API_BASE_URL}/user/feedback`,
          {
            comments: feedback.comments,
            rating: feedback.rating || 3,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getUserToken()}`,
            },
          }
        );
      } else {
        const response = await axios.put(
          `${constants.API_BASE_URL}/user/feedback`,
          {
            comments: feedback.comments,
            rating: feedback.rating || 3,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getUserToken()}`,
            },
          }
        );
      }
      setIsLoader(false);
      setFeedBackForm(!openFeedBackForm);
      setModalMessage("Review Submited succesfully");
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      {isloader && <Loader />}
      {isModalOpen && (
        <Modal
          typeOfModal={modalType}
          message={modalMessage}
          closeModal={closeModal}
        />
      )}
      {openFeedBackForm && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="w-lg mx-auto p-4 shadow-lg rounded-2xl border border-gray-200 bg-white">
            <div
              className="flex justify-end"
              onClick={() => setFeedBackForm(false)}
            >
              <span className="material-icons cursor-pointer text-xl">X</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={feedback?.profile_img_url}
                  alt={feedback.user_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {feedback.first_name} {feedback.last_name}
                  </h3>
                  <p className="text-gray-500 text-sm">@{feedback.user_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    fill={index < feedback.rating ? "#FACC15" : "#E5E7EB"}
                    strokeWidth={0}
                    onClick={() =>
                      setFeedback({ ...feedback, rating: index + 1 })
                    }
                    className="cursor-pointer"
                  />
                ))}
              </div>
              <textarea
                name="comments"
                value={feedback.comments}
                onChange={handleChange}
                placeholder="Write your feedback..."
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                {feedback.feedback_id ? "Update Feedback" : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
      {openRequestForm && (
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="w-lg mx-auto p-4 shadow-lg rounded-2xl border border-gray-200 bg-white">
          <div
            className="flex justify-end cursor-pointer"
            onClick={() => setOpenRequestForm(false)}
          >
            <span className="material-icons text-xl">X</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-semibold text-center">
              Request to Join Our Car Rental Service
            </h3>

            <label className="font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={requestDetails.first_name}
              onChange={handleJoinChange}
              placeholder="First Name"
              className="w-full p-2 border rounded-md"
            />

            <label className="font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={requestDetails.last_name}
              onChange={handleJoinChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded-md"
            />

            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={requestDetails.email}
              onChange={handleJoinChange}
              placeholder="Email"
              className="w-full p-2 border rounded-md"
            />

            <label className="font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={requestDetails.phone}
              onChange={handleJoinChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded-md"
            />

            <label className="font-medium">Additional Information</label>
            <textarea
              name="additional_info"
              value={requestDetails.additional_info}
              onChange={handleJoinChange}
              placeholder="Tell us why you want to join..."
              className="w-full p-2 border rounded-md"
            />

            <button
              onClick={handleJoinSubmit}
              className="bg-black text-white px-4 py-2 mt-6 rounded-md"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    )}
      <div className="flex justify-center items-center" >
        <div
          className="bg-[#121212] rounded-[15px] flex flex-col items-center w-full h-[22vh] p-24"
          style={{ padding: "20px" }}
        >
          <h2 className="text-white text-2xl p-2">
            <h1 direction="right">Contact Us</h1>
          </h2>
          <div
            className="mt-4  rounded-lg px-2 py-1 w-[480px] flex justify-center items-center space-x-5"
            style={{ padding: "20px" }}
          >
            {/* Email */}
            <p className="flex items-center  text-white pb-2">
              <svg
                className="w-6 h-6 text-white mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"
                />
              </svg>
              dndrentals@gmail.com
            </p>

            {/* Phone */}
            <p className="flex items-center text-white pb-2">
              <svg
                className="w-6 h-6 text-white mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                />
              </svg>
              +918328289090
            </p>
            {userDetails && (
              <p
                className="flex items-center rounded-2xl text-white pb-2 cursor-pointer whitespace-nowrap"
                onClick={() => setFeedBackForm(true)}
              >
                <MessageSquare size={20} />{" "}
                <span className="pl-3">FeedBack Us</span>
              </p>
            )}
            {userDetails && (
              <p
                className="flex items-center rounded-2xl pb-2 text-white cursor-pointer whitespace-nowrap"
                onClick={() => setOpenRequestForm(true)}
              >
                <JoystickIcon size={20} /> <span className="pl-3">Join Us</span>
              </p>
             
            )}
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Contact;
