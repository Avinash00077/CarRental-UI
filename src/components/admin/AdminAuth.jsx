import React, { useState } from "react";
import axios from "axios";
import constants from "../../config/constants";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AdminAuth = () => {
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  });
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({ ...adminForm, [name]: value });
  };
  const handleSubmit = async () => {
    setOpenLoader(true);
    try {
      const response = await axios.get(`${constants.API_BASE_URL}/admin/auth`, {
        headers: {
          email: adminForm.email,
          password: adminForm.password,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data," response Value is ")
      localStorage.setItem("adminAuthToken", response.data.data.token);
      localStorage.setItem(
        "adminDetails",
        JSON.stringify(response.data.data.adminDetails)
      );
      setOpenLoader(false);
      setOpenModal(true);
      setModalType("success");
      setTimeout(() => {
        setOpenModal(false);
      }, 3000);
      setModalMessage("Admin Login Success");
      console.log(response, "Response Value is");
      setOpenModal(true);
      setTimeout(() => {
        window.location.href = "/admin/car-upload";
      }, 4000);
   
    } catch (error) {
      console.error(
        "Error in handleSubmit:",
        error.response ? error.response.data : error.message
      );
      setOpenLoader(false);
      setOpenModal(true);
      setModalType("failure");
      setModalMessage("Something went wrong");
    }
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div
      className="flex justify-center items-center w-full"
      style={{ marginTop: "10%" }}
    >
      {openLoader && <Loader />}
      {openModal && (
        <Modal
          typeOfModal={modalType}
          message={modalMessage}
          closeModal={closeModal}
        />
      )}
      <div
        className="flex flex-col justify-center items-center w-[30%] bg-gray-50 rounded-lg shadow-2xl"
        style={{ padding: "20px" }}
      >
        <h1 className="text-xl font-semibold text-[#121212]">Admin Login</h1>
        <div className="w-[85%] " style={{ marginRight: "10px" }}>
          <label
            className="block  mb-1"
            style={{ paddingTop: "13px", paddingLeft: "5px" }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={adminForm.email}
            onChange={handleInputChange}
            placeholder="Enter Admin's Email"
            className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
            style={{ padding: "8px", margin: "4px 0px" }}
          />
        </div>
        <div className="w-[85%] " style={{ marginRight: "10px" }}>
          <label
            className="block  mb-1"
            style={{ paddingTop: "6px", paddingLeft: "5px" }}
          >
            Password
          </label>
          <input
            type="email"
            name="password"
            value={adminForm.password}
            onChange={handleInputChange}
            placeholder="Enter Admin's Password"
            className="w-full text-sm bg-white rounded-lg border border-gray-300 px-2 py-1 focus:outline-none"
            style={{ padding: "8px", margin: "4px 0px" }}
          />
        </div>
        <button
          // style={{
          //   padding: "8px",
          //   margin: "27px 0px",
          //   marginLeft: "0%",
          //   marginTop: "25px",
          // }}
          type="submit"
          onClick={() => handleSubmit()}
          className="bg-[#121212] w-9/12 mt-7 hover:bg-[#121212] text-medium py-2 px-5 rounded-full text-white hover:scale-105 shadow-lg transition-colors duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AdminAuth;
