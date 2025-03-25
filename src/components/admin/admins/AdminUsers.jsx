import React, { useState, useEffect } from "react";
import constants from "../../../config/constants";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { useScreenSize } from "../../../context/screenSizeContext";

const { isScreenSize } = useScreenSize;

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [locationsData, setlocationsData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    user_type: "regional_user",
    location: "",
    active: "Y"
  });

  const [showAddForm, setShowAddForm] = useState(false); // State to toggle the add form visibility

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoaderOpen(true);
      const response = await axios.get(`${constants.API_BASE_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
        },
      });
      setAdmins(response.data.data);
      fetchLocations();
      setIsLoaderOpen(false);
    } catch (error) {
      setIsLoaderOpen(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${constants.API_BASE_URL}/admin/locations`,
        {
          headers: {
            Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
          },
        }
      );
      let locations = [];

      response.data.data.map((i) => {
        locations.push(i.location);
      });

      setlocationsData(locations);
    } catch (error) {
      setIsLoaderOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOrEditAdmin = async (e) => {
    e.preventDefault();
    try {
      console.log(formData," FormData Vale is HHHHHHHHHHHHHHHHHHHhh")
      setIsLoaderOpen(true);
      let response;
      if (selectedAdmin) {
        // Editing existing admin
        if(formData.user_type === 'super_user'){
          formData.location = null
        }
        formData.admin_id = selectedAdmin.admin_id
        response = await axios.put(
          `${constants.API_BASE_URL}/admin/update`,

          formData,
          {
            headers: {
              Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
            },
          }
        );
      } else {
        // Adding new admin
        response = await axios.post(
          `${constants.API_BASE_URL}/admin/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${constants?.ADMIN_AUTHTOKEN}`,
            },
          }
        );
      }
      setIsLoaderOpen(false);
      fetchAdmins(); // Refresh the admin list after adding/editing
      setSelectedAdmin(null); // Reset selectedAdmin after adding/editing
      setShowAddForm(false); // Hide the form after adding/editing
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        user_type: "",
        location: "",
        active: "Y"
      }); // Reset form data
    } catch (error) {
      setIsLoaderOpen(false);
      console.error("Error adding/editing admin:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      {isLoaderOpen && <Loader />}
      {showAddForm && (
        <div
          className={`${
            isScreenSize ? "h-[90vh]" : "h-[98vh]"
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full mt-32">
            <h2 className="text-3xl font-bold mb-5">
              {selectedAdmin ? "Edit Admin" : "Add Admin"}
            </h2>
            <form onSubmit={handleAddOrEditAdmin}>
              <div className="flex w-full justify-between place-content-evenly">
                <div className="w-10/12">
                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : "flex w-full space-x-6 justify-between place-content-evenly"
                    }`}
                  >
                    <div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                    <div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter Email"
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : "flex w-full space-x-6 justify-between place-content-evenly"
                    }`}
                  >
                    <div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Phone Number:
                      </label>
                      <input
                        type="text"
                        name="phone_number"
                        placeholder="Enter phone number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                    {!selectedAdmin &&(
                    <div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Password:
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      />
                    </div>
                    )}
                    {selectedAdmin &&(<div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Status:
                      </label>
                      <select
                        name="active"
                        value={formData.active}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      >
                        <option value="Y">Active</option>
                        <option value="N">In Active</option>
                      </select>
                    </div>)}
                  </div>

                  <div
                    className={`${
                      isScreenSize
                        ? ""
                        : "flex w-full space-x-6 justify-between place-content-evenly"
                    }`}
                  >
                    <div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Admin Type:
                      </label>
                      <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      >
                        <option value="regional_user">regional_user</option>
                        <option value="super_user">super_user</option>
                      </select>
                    </div>
                    {formData.user_type !== 'super_user' &&(
                    <div className="w-6/12">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ">
                        Location:
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                        required
                      >
                        <option value="">Select Location</option>
                        {locationsData.map((i) => (
                          <option value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-end w-full mt-10 space-x-5">
                <button
                  className="bg-black p-2 px-8 cursor-pointer text-white rounded-lg hover:scale-105 hover:-translate-y-1"
                  onClick={() => {setShowAddForm(!showAddForm); setFormData(null)}} // Toggle form visibility
                >
                  {"Cancel"}
                </button>

                <button
                  type="submit"
                  className="bg-black p-2 px-8 cursor-pointer text-white rounded-lg hover:scale-105 hover:-translate-y-1"
                >
                  {selectedAdmin ? "Update Admin" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {admins.length > 0 && !showAddForm && (
        <div
          className={`${
            isScreenSize ? "h-[90vh]" : "h-[98vh]"
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
            Admins
          </h1>

          <button
            className="bg-[#121212] p-2 px-8 cursor-pointer text-gray-100 hover:-translate-y-1 rounded-lg mb-5"
            onClick={() => {setShowAddForm(!showAddForm), setFormData({
                name: "",
                email: "",
                phone_number: "",
                password: "",
                user_type: "",
                location: "",
                active: "Y"
              })}} // Toggle form visibility
          >
            {"Add Admin"}
          </button>

          <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    AdminId
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                    <td className="px-6 py-4">{admin.admin_id}</td>
                    <td className="px-6 py-4">{admin.name}</td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4">{admin.phone_number}</td>
                    <td className="px-6 py-4">{admin.user_type}</td>
                    <td className="px-6 py-4">{admin.location}</td>
                    <td className="px-6 py-4">
                      {admin.active === "Y" ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setFormData({
                            name: admin.name,
                            email: admin.email,
                            phone_number: admin.phone_number,
                            password: "", // Do not pre-populate password for security reasons
                            user_type: admin.user_type,
                            location: admin.location,
                            active: admin.active
                          });
                          setShowAddForm(true)
                        }}
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
