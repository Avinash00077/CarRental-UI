import React, { useState, useEffect } from "react";
import axios from "axios";
import constants from "../../config/constants";
import { Pencil } from "lucide-react";
import Loader from "../Loader/Loader";
import FileUpload from "../FileUpload";
import { useScreenSize } from "../../context/screenSizeContext";
import { data } from "jquery";

const UserProfile = () => {
  const [userDeatils, setUserDeatils] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const isScreenSize = useScreenSize().isScreenSmall;
  const [editFormInfo, setEditFormInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    dob: "",
    address: "",
  });
  const token = localStorage.getItem("authToken");
  const fetchUserData = async () => {
    setIsLoaderOpen(true);

    try {
      const response = await axios.get(`${constants.API_BASE_URL}/user/id`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setIsLoaderOpen(false);
      setUserDeatils(response?.data?.data[0]);
      setEditFormInfo({
        first_name: response?.data?.data[0].first_name || "",
        last_name: response?.data?.data[0].last_name || "",
        email: response?.data?.data[0].email || "",
        phone_number: response?.data?.data[0].phone_number || "",
        gender: response?.data?.data[0].gender || "",
        dob: response?.data?.data[0].dob || "",
        address: response?.data?.data[0].address || "",
      });
    } catch (error) {
      setIsLoaderOpen(false);
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setEditFormInfo({ ...editFormInfo, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setEditFormInfo(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoaderOpen(true);
    try {
      const response = await axios.put(
        `${constants.API_BASE_URL}/user/update`,
        {
          first_name: editFormInfo.first_name,
          last_name: editFormInfo.last_name,
          email: editFormInfo.email,
          gender: editFormInfo.gender,
          dob: editFormInfo.dob,
          address: editFormInfo.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsEditOpen(false);
      fetchUserData();
      setIsLoaderOpen(false);
    } catch (error) {
      setIsLoaderOpen(false);
      console.error("Error fetching user data:", error);
    }
  };

  const handleUploadImage = async (data, img_type, profile_type) => {
    setIsLoaderOpen(true);
    if (!data) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image_type", img_type);
    formData.append(profile_type, data.selectedFile);
    if (data.type == "Licence") {
      formData.append("driving_license_number", data.LisenceValue);
      formData.append("driving_license_expiry", data.expiryDate);
    }
    if (data.type == "Aaadhar") {
      formData.append("aadhar_number", data.aadharNumber);
    }
    try {
      const response = await fetch(
        `${constants.API_BASE_URL}/user/image-upload`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed!");
      const result = await response.json();
      setUploadedFile(result); // Store uploaded file response if needed
      fetchUserData();
    } catch (error) {
      console.error("Error:", error);
      setIsLoaderOpen(false);
      alert("Image upload failed.");
    }
  };

  return (
    <div
      style={{
        marginTop: "5%",
        padding: isScreenSize ? "0" : "0px",
        paddingTop: isScreenSize ? "0" : "0px",
      }}
      className="rounded-lg w-full"
    >
      {isLoaderOpen && <Loader />}
      {isEditOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div
            className="bg-white relative rounded-2xl shadow-2xl w-[570px] h-auto mx-4 md:mx-0 p-8 space-y-8"
            style={{ padding: "25px" }}
          >
            <h2
              className="text-xl text-[#6f82c6] font-semibold mb-4 text-center"
              style={{ marginBottom: "10px" }}
            >
              Edit Your Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex justify-center items-center">
                <div className="w-1/2">
                  <label className="block font-medium">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editFormInfo.first_name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-400 rounded-lg"
                    style={{ padding: "5px", margin: "5px 0px" }}
                    placeholder="First Name"
                  />
                </div>
                <div className="w-1/2" style={{ marginLeft: "10px" }}>
                  <label className="block font-medium">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editFormInfo.last_name || userDeatils.last_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-400 rounded-lg"
                    style={{ padding: "5px", margin: "5px 0px" }}
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={editFormInfo.email || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded"
                style={{ padding: "5px", margin: "5px 0px" }}
                placeholder="Email"
              />

              {/* Phone Number */}
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={editFormInfo.phone_number || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded"
                style={{ padding: "5px", margin: "5px 0px" }}
                placeholder="Phone Number"
              />

              {/* Date of Birth */}
              <div className="flex justify-center items-center">
                <div className="w-1/2">
                  <label className="block font-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={editFormInfo.dob || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-400 rounded"
                    style={{ padding: "5px", margin: "5px 0px" }}
                  />
                </div>
                <div className="w-1/2" style={{ marginLeft: "10px" }}>
                  <label className="block font-medium">Gender</label>
                  <select
                    name="gender"
                    value={editFormInfo.gender || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-400 rounded"
                    style={{ padding: "7px", margin: "5px 0px" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <textarea
                rows={4}
                name="address"
                value={editFormInfo.address || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded"
                style={{ padding: "5px", margin: "5px 0px" }}
                placeholder="Enter address"
              />

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  style={{ padding: "5px 10px", margin: "0px 15px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  style={{ padding: "5px 10px", margin: "0px" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {userDeatils && (
        <div>
          <div className="shadow-lg relative">
            <div className="relative">
              <img
                src={userDeatils?.profile_img_url}
                className={`w-full ${
                  isScreenSize ? "h-[200px]" : "h-[260px]"
                }  object-cover rounded-lg`}
              />
              <div className="absolute bottom-4 right-4 flex p-3 rounded-full shadow-md cursor-pointer">
                <FileUpload
                  type="profile"
                  onUpload={(data) =>
                    handleUploadImage(data, "profile", "profile_image")
                  }
                />
              </div>
            </div>

            <div className="rounded-lg" style={{ padding: "10px" }}>
              <div
                className={`absolute ${
                  isScreenSize ? "bottom-[50px] left-1" : "bottom-[20px] left-5"
                } `}
              >
                <img
                  src="https://img.freepik.com/premium-vector/silhouette-young-man-profile-against-stark-black-background_1058532-30803.jpg?w=360"
                  className={` ${
                    isScreenSize ? "w-[90px] h-[90px]" : "w-[110px] h-[110px]"
                  } rounded-full border-4 border-white shadow-lg`}
                />
              </div>
              <div className="mt-16 flex justify-center space-x-8 ">
                <button
                  className={`px-4 py-2 font-semibold transition-all ${
                    activeTab === "details"
                      ? "border-b-3 border-blue-500 text-blue-600"
                      : "text-gray-600"
                  }`}
                  style={{ padding: "0px 5px", margin: "0px" }}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>

                <button
                  className={`px-4 py-2 font-semibold transition-all ${
                    activeTab === "documents"
                      ? "border-b-3 border-blue-500 text-blue-600"
                      : "text-gray-600"
                  }`}
                  style={{ padding: "5px 10px", margin: "10px" }}
                  onClick={() => setActiveTab("documents")}
                >
                  Documents
                </button>

                <button
                  className={`px-4 py-2 font-semibold transition-all ${
                    activeTab === "status"
                      ? "border-b-3 border-blue-500 text-blue-600"
                      : "text-gray-600"
                  }`}
                  style={{ padding: "5px 10px", margin: "10px" }}
                  onClick={() => setActiveTab("status")}
                >
                  Status
                </button>
              </div>
            </div>
          </div>

          <div
            className={`p-6   ${
              isScreenSize ? "w-[390px] h-[47vh] bg-gradient-to-l from-[#caefd7] via-[#f5bfd7] to-[#abc9e9]":'h-[41vh] bg-gradient-to-t from-[#caefd7] via-[#f5bfd7] to-[#abc9e9]'
            } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200  rounded-lg rounded-b-none shadow-md`}
            style={{ padding: "20px" }}
          >
            {activeTab === "details" && (
              <div>
                <div className="flex flex-wrap items-center  justify-between mb-5">
                  <div className="text-xl font-semibold text-[#6f82c6]">
                    User Details
                  </div>
                  <div className="flex items-center font-semibold space-x-2 cursor-pointer">
                    <span style={{ padding: "5px 10px" }}>Edit</span>
                    <Pencil size={18} onClick={() => setIsEditOpen(true)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "UserName",
                      value: `${userDeatils?.first_name} ${userDeatils?.last_name}`,
                    },
                    { label: "Email", value: userDeatils?.email },
                    { label: "Phone Number", value: userDeatils?.phone_number },
                    { label: "Date Of Birth", value: userDeatils?.dob },
                    { label: "Gender", value: userDeatils?.gender },
                    {
                      label: "Driving Licence Status",
                      value:
                        userDeatils?.driving_license_verified === "Y"
                          ? "Yes"
                          : "No",
                      status:
                        userDeatils?.driving_license_verified === "Y"
                          ? "text-green-300"
                          : "text-red-500",
                    },
                    {
                      label: "Aadhar Verified",
                      value:
                        userDeatils?.aadhar_verified === "Y" ? "Yes" : "No",
                      status:
                        userDeatils?.aadhar_verified === "Y"
                          ? "text-green-300"
                          : "text-red-500",
                    },
                    { label: "User Id", value: "78YTJN986" },
                    { label: "User Address", value: userDeatils?.address },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{ padding: "10px" }}
                      className={`p-4 flex items-center rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:bg-[#6f82c6] hover:text-white 
  ${item.label == "User Address" ? "w-[350px] h-[100px]" : ""} 
  ${item.status || ""}`}
                    >
                      <div
                        className="font-semibold "
                        style={{ paddingRight: "10px" }}
                      >
                        {item.label} <span>:</span>
                      </div>
                      <div className="ml-2">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "documents" && (
              <div>
                <h2
                  className="text-xl font-semibold mb-2 text-[#6f82c6]"
                  style={{ margin: "10px 0px" }}
                >
                  User Documents
                </h2>
                <div className="md:flex justify-start items-center">
                  <div className="flex justify-start items-center">
                    <p
                      style={{ margin: "0px 10px", width: "150px" }}
                      className="text-lg"
                    >
                      Drivers Licence:
                    </p>
                    <img
                      src={userDeatils.driving_license_img_url}
                      className="w-48 h-20 rounded-lg"
                      style={{ margin: "10px" }}
                    ></img>
                    <FileUpload
                      onUpload={(data) =>
                        handleUploadImage(
                          data,
                          "driving_license",
                          "driving_license_image"
                        )
                      }
                      type="Licence"
                    />
                  </div>
                  <div className="flex justify-start items-center">
                    <p
                      style={{ margin: "0px 10px", width: "150px" }}
                      className="text-lg"
                    >
                      Aadhar Card :
                    </p>
                    <img
                      src={userDeatils?.aadhar_img_url}
                      className="w-48 h-20 rounded-lg"
                      style={{ margin: "10px" }}
                    ></img>
                    <FileUpload
                      onUpload={(data) =>
                        handleUploadImage(data, "aadhar", "aadhar_image")
                      }
                      type="Aaadhar"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "status" && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Account Status</h2>
                <p>Status: Active</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
