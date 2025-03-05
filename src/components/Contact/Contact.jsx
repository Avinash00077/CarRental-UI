import React, { useState, useEffect } from "react";
import constants from "../../config/constants";
import axios from "axios";
import { Star } from "lucide-react";
import { getUserToken} from "../../utils/getToken"
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";

const Contact = () => {
  const [openFeedBackForm, setFeedBackForm] = useState(false);
  const [isloader, setIsLoader] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalMessage, setModalMessage] = useState("");
  const [userDetails,setUserDeatils] = useState()
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
  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if(!userDetails){
      const userDetails = JSON?.parse(localStorage.getItem("userDetails"));
      setUserDeatils(userDetails)
      console.log(userDetails," User Deatils hello is ")
      if (userDetails) {
        setFeedback((prev) => ({
          ...prev,
          user_id: userDetails.user_id,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          user_name: userDetails.user_name,
          profile_img_url: userDetails.profile_img_url,
        }));
      }
    }
  }, [userDetails]);
  console.log(userDetails," Use Deatils are ")

  const handleSubmit = async (e) => {
    setIsLoader(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${constants.API_BASE_URL}/user/feedback`, {
        "comments": feedback.comments,
        "rating": feedback.rating|| 3
    },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getUserToken()}`,
                  },
                }
      );
      setIsLoader(false);
      setFeedBackForm(!openFeedBackForm)  
      setModalMessage("Review Submited succesfully")
      setIsModalOpen(true)
      setTimeout(()=>{
        setIsModalOpen(false)
      },2000)    
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };
  const closeModal = ()=>{
    setIsModalOpen(false)
  }
  return (
    <div>
      {isloader&&(
        <Loader/>
      )}
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={feedback.profile_img_url}
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
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center items-center">
        <div
          className="bg-[#121212] rounded-[15px] flex flex-col items-center w-full h-[20vh] p-24"
          style={{ padding: "20px" }}
        >
          <h2 className="text-white text-2xl p-2">
            <marquee direction="right">Contact Us</marquee>
          </h2>
          <div
            className="mt-4  rounded-lg px-2 py-1 w-[350px] flex justify-between items-center"
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
                className="flex items-center  rounded-2xl text-white pb-2 ml-10 cursor-pointer"
                onClick={() => setFeedBackForm(!openFeedBackForm)}
              >
                FeedBack Us
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
