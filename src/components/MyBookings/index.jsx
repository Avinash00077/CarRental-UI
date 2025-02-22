import React, { useState, useEffect } from "react";
import axios from "axios";
import constants from "../../config/constants";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { getUserToken } from "../../utils/getToken";
import { useScreenSize } from "../../context/screenSizeContext";

const MyBookings = () => {
  const [loaderOpen, setLoaderOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFailureMessage, setModalFailureMessage] = useState(
    "Something went wrong"
  );
  const [bookingsData, setBookingsData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
 const isScreenSize = useScreenSize().isScreenSmall;
 
  const getUserBookings = async () => {
    if (getUserToken()) {
      try {
        const response = await axios.get(
          `${constants.API_BASE_URL}/user/bookings`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getUserToken()}`,
            },
          }
        );
        if (response.status === 200) {
          setBookingsData(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setModalOpen(true);
        setModalFailureMessage(
          error.response?.data?.message || "Something went wrong"
        );
        if (error.response?.data?.message === "InValid Token") {
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
            location.reload();
          }, 2000);
        }
      } finally {
        setLoaderOpen(false);
      }
    }
  };

  useEffect(() => {
    getUserBookings();
  }, []);

  return (
    <div 
    className="w-full"
      // style={{
      //   display: "flex",
      //   flexDirection: "column",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   minHeight: "100vh",
      //   padding: "16px",
      // }}
    >
      {loaderOpen && <Loader />}

      {modalOpen && (
        <Modal
          typeOfModal="failure"
          message={modalFailureMessage}
          closeModal={() => setModalOpen(false)}
        />
      )}

      {bookingsData.length > 0 ? (
       <div
       className={`${
         isScreenSize ? "h-[90vh] " : "h-[98vh] "
       } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
     >
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 align-middle">
            My bookings
          </h1>
          <div className="relative overflow-x-auto shadow-md w-full sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Car
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Price
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
                {bookingsData.map((booking) => (
                  <tr
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                    // key={booking.booking_id}
                    // style={{ cursor: "pointer", transition: "background 0.3s" }}
                    // onMouseEnter={(e) =>
                    //   (e.currentTarget.style.backgroundColor = "#f8f8f8")
                    // }
                    // onMouseLeave={(e) =>
                    //   (e.currentTarget.style.backgroundColor = "transparent")
                    // }
                    // onClick={() => {
                    //   setSelectedBooking(booking);
                    //   setModalOpen(true);
                    // }}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {booking.car_name}
                    </th>
                    <td className="px-6 py-4">{booking.start_date}</td>
                    <td className="px-6 py-4">{booking.end_date}</td>
                    <td className="px-6 py-4">₹{booking.total_price}</td>
                    <td className="px-6 py-4">{booking.booking_status}</td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        key={booking.booking_id}
                        style={{ cursor: "pointer", transition: "background 0.3s" }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setModalOpen(true);
                        }}
                      >
                      {booking.booking_status === 'CONFIRMED' ? "Edit" : "View" }
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p style={{ color: "#666", marginTop: "16px" }}>No bookings found.</p>
      )}

      {modalOpen && selectedBooking && (
        <div
        className={`${
          isScreenSize ? "h-[90vh] pt-80 " : "h-[98vh] "
        } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
      >
       
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl flex flex-col md:flex-row relative">
      
          {/* Close Button */}
          <button 
            className="absolute top-0 right-3 to-black px-3 py-1 rounded-full text-lg hover:bg-as transition"
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>
      
          {/* Left: Car Image */}
          <div className="w-full md:w-1/2">
            <img 
              src={selectedBooking.car_cover_img_url} 
              alt={selectedBooking.car_name} 
              className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
            />
          </div>
      
          {/* Right: Booking Details */}
          <div className="w-full md:w-1/2 p-6 space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">{selectedBooking.car_name}</h2>
            <p className="text-gray-700"><strong>Brand:</strong> {selectedBooking.brand}</p>
            <p className="text-gray-700"><strong>Model Year:</strong> {selectedBooking.model_year}</p>
            <p className="text-gray-700"><strong>Location:</strong> {selectedBooking.car_location}</p>
            <p className="text-gray-700"><strong>Start Date:</strong> {selectedBooking.start_date} ({selectedBooking.start_time})</p>
            <p className="text-gray-700"><strong>End Date:</strong> {selectedBooking.end_date} ({selectedBooking.end_time})</p>
            <p className="text-gray-900 font-semibold text-lg"><strong>Total Price:</strong> ₹{selectedBooking.total_price}</p>
            <p className="text-gray-700"><strong>Payment Mode:</strong> {selectedBooking.payment_mode}</p>
            <p 
              className={`font-bold text-lg `}
            >
            Status:
              <strong className={`${
                selectedBooking.booking_status === "FAILURE" ?  "text-red-600" : selectedBooking.booking_status === "PENDING" ? "text-amber-300" : "text-green-600"
              }`}> {selectedBooking.booking_status} </strong>
            </p>
      
            {/* Cancel Button for Confirmed Bookings */}
            {selectedBooking.booking_status === "CONFIRMED" && (
              <button 
                className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                onClick={() => handleCancelBooking(selectedBooking.booking_id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default MyBookings;
