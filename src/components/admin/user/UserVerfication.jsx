import { useState, useEffect } from "react";
import constants from "../../../config/constants";
import { useScreenSize } from "../../../context/screenSizeContext";
import Loader from "../../Loader/Loader";
import axios from "axios";

const { isScreenSize } = useScreenSize;

export default function UserVerification() {
  const [users, setUsers] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [comments, setComments] = useState('');
  const adminAuthToken = localStorage.getItem("adminAuthToken");
  useEffect(() => {
    // fetch(`${constants.API_BASE_URL}/admin/user/verfication`, {
    //   headers: {
    //     Authorization: `Bearer ${adminAuthToken}`,
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => setUsers(data.data));
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        setIsLoaderOpen(true)
      const response = await axios.get(`${constants.API_BASE_URL}/admin/user/verfication`, {
        headers: {
          Authorization: `Bearer ${adminAuthToken}`,
        },
      });
  
      setUsers(response.data.data);
      setIsLoaderOpen(false)
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setIsLoaderOpen(false)
    }
  }

  const handleChange = (e) => {
    setComments(e.target.value)
  };
  

  const handleVerify = async (userId, status, type) => {
    console.log(`User ${userId} ${type} verification set to: ${status}`);
    try {
        setIsLoaderOpen(true)
      let data;
      if (type === "aadhar") {
        data = {
          user_id: userId,
          aadhar_verified: status,
          comments: comments ? comments : null
        };
      } else if (type === "driving_license") {
        data = {
          user_id: userId,
          driving_license_verified: status,
          comments: comments ? comments : null
        };
      } else {
        throw new Error("invalid type");
      }
      await axios.put(`${constants.API_BASE_URL}/admin/user/verfication`, 
        data, // Move data here as the second argument
        {
          headers: {
            Authorization: `Bearer ${adminAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedDoc(null)
      fetchUsers();
      setComments('')
      setIsLoaderOpen(false)
    } catch (error) {
      console.log(error);
      setIsLoaderOpen(false)
    }
  };
  console.log(selectedDoc?.type, selectedDoc?.type == "aadhar");

  return (
    <div className="flex items-center justify-center">
        {isLoaderOpen && <Loader />}
      {users?.length > 0 ? (
        <div
          className={`${
            isScreenSize ? "h-[90vh] " : "h-[98vh] "
          } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
        >
          <h1 className=" text-4xl  font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 mb-10 align-middle">
            User For Verfication
          </h1>
          <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Aadhaar
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Driving License
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                  >
                    <td className="px-6 py-4">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4">{user.email} </td>
                    <td className="px-6 py-4">
                      {user.aadhar_verified === "N" ? (
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          key={user.user_id}
                          style={{
                            cursor: "pointer",
                            transition: "background 0.3s",
                          }}
                          onClick={() => {
                            setSelectedDoc({
                              img: user.aadhar_img_url,
                              number: user.aadhar_number,
                              type: "aadhar",
                              userId: user.user_id,
                            });
                          }}
                        >
                          View
                        </a>
                      ) : (
                        <span className=" text-green-300">Verfied</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.driving_license_verified === "N" ? (
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          key={user.user_id}
                          style={{
                            cursor: "pointer",
                            transition: "background 0.3s",
                          }}
                          onClick={() => {
                            setSelectedDoc({
                              img: user.driving_license_img_url,
                              number: user.driving_license_number,
                              type: "driving_license",
                              expiry: user.driving_license_expiry,
                              userId: user.user_id,
                            });
                          }}
                        >
                          View
                        </a>
                      ) : (
                        <span className=" text-green-300">Verfied</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No User </p>
      )}

      {selectedDoc?.type === "aadhar" && (
        <div
          className={`${
            isScreenSize ? "h-[90vh] pt-80 " : "h-[98vh] "
          } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
        >
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl flex flex-col md:flex-row relative">
            {/* Close Button */}
            <button
              className="absolute top-0 right-3 to-black px-3 py-1 rounded-full text-lg hover:bg-as transition"
              onClick={() => setSelectedDoc(null)}
            >
              ✕
            </button>

            {/* Left: Car Image */}
            <div className="w-full md:w-1/2">
              <img
                src={selectedDoc.img}
                alt={selectedDoc.type}
                className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Right: Booking Details */}
            <div className="w-full md:w-1/2 p-6 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedDoc.type}
              </h2>
              <p className="text-gray-700">
                <strong>Aadhar Number:</strong> {selectedDoc.number}
              </p>
              <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                name="Comments"
                placeholder="Enter comments"
                rows={4}
                value={comments}
                
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
              <div className=" space-x-6 flex justify-center items-center">
                <button
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                  onClick={() =>
                    handleVerify(selectedDoc.userId, "N", "aadhar")
                  }
                >
                  Reject
                </button>
                <button
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                  onClick={() =>
                    handleVerify(selectedDoc.userId, "Y", "aadhar")
                  }
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedDoc?.type === "driving_license" && (
        <div
          className={`${
            isScreenSize ? "h-[90vh] pt-80 " : "h-[98vh] "
          } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
        >
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl flex flex-col md:flex-row relative">
            {/* Close Button */}
            <button
              className="absolute top-0 right-3 to-black px-3 py-1 rounded-full text-lg hover:bg-as transition"
              onClick={() => setSelectedDoc(null)}
            >
              ✕
            </button>

            {/* Left: Car Image */}
            <div className="w-full md:w-1/2">
              <img
                src={selectedDoc.img}
                alt={selectedDoc.type}
                className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Right: Booking Details */}
            <div className="w-full md:w-1/2 p-6 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedDoc.type}
              </h2>
              <p className="text-gray-700">
                <strong>Driving Lisence Number:</strong> {selectedDoc.number}
              </p>
              <p className="text-gray-700">
                <strong>Model Year:</strong> {selectedDoc.expiry}
              </p>
              <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                name="Comments"
                placeholder="Enter comments"
                rows={4}
                value={comments}
                
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
              <div className=" space-x-6 flex justify-center items-center">
                <button
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                  onClick={() =>
                    handleVerify(selectedDoc.userId, "N", "driving_license")
                  }
                >
                  Reject
                </button>
                <button
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                  onClick={() =>
                    handleVerify(selectedDoc.userId, "Y", "driving_license")
                  }
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
