import React, { useState, useEffect } from "react";

import { Star } from "lucide-react";
import axios from "axios";
import constants from "../../config/constants";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { getUserToken } from "../../utils/getToken";
import { useScreenSize } from "../../context/screenSizeContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MyBookings = () => {
  const [loaderOpen, setLoaderOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFailureMessage, setModalFailureMessage] = useState(
    "Something went wrong"
  );
  const [bookingsData, setBookingsData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isWhichModal, setIsWhichModal] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState([17.385044, 78.486671]);
  const navigate = useNavigate();
  const isScreenSize = useScreenSize().isScreenSmall;
  const carIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png", // Car marker icon
    iconSize: [35, 35],
  });

  const FocusOnMarker = ({ position }) => {
    const map = useMap();

    // Adjust latitude slightly to move the marker higher in view
    const adjustedPosition = [position[0] - 0.026, position[1]]; // Shift upwards

    map.setView(adjustedPosition, 13, { animate: true });

    return null;
  };

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

  const handleCancelBooking = async (booking_id) => {
    try {
      setLoaderOpen(true);
      const response = await axios.put(
        `${constants.API_BASE_URL}/user/booking/cancel`,
        {}, // Empty body since we're passing booking_id in headers
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUserToken()}`,
            booking_id: booking_id,
          },
        }
      );

      setModalOpen(false);
      setLoaderOpen(false);
      location.reload();
    } catch (error) {
      console.error(error);
      setLoaderOpen(false);
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
    }
  };

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const isWhichScreen = (booking, screen) => {
    if (screen === "RateNow" && booking.review_id) {
      setComment(booking.comment);
      setRating(booking.rating);
    } else {
      if (booking.latitude && booking.longitude) {
        setLocation([booking.latitude, booking.longitude]);
      }
    }
    console.log(screen);
    setIsWhichModal(screen);
  };
  const handleRatingSubmit = async (booking_id, review_id) => {
    try {
      if (!review_id) {
        const response = await axios.post(
          `${constants.API_BASE_URL}/user/booking/review`,
          {
            booking_id: booking_id,
            rating: rating,
            comments: comment,
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
          `${constants.API_BASE_URL}/user/booking/review`,
          {
            booking_id: booking_id,
            rating: rating,
            comments: comment,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getUserToken()}`,
            },
          }
        );
      }
      setModalOpen(false);
      location.reload();
    } catch (error) {
      console.error(error);
      setModalOpen(true);
      setModalFailureMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };
  console.log(
    modalOpen && isWhichModal === "RateNow" && selectedBooking,
    modalOpen,
    isWhichModal === "RateNow"
  );
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

      {/* {bookingsData.length > 0 ? (
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
                        className="font-medium text-[#121212] hover:underline"
                        key={booking.booking_id}
                        style={{
                          cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          isWhichScreen(booking);
                          setModalOpen(true);
                        }}
                      >
                        {booking.booking_status === "CONFIRMED" &&
                        booking.ride_status === "NOT_STARTED"
                          ? "Edit"
                          : booking.ride_status === "COMPLETED" && !booking.review_id
                          ? "RateNow"
                          : booking.ride_status === "COMPLETED" &&
                            booking.review_id
                          ? "EditReview"
                          : "View"}
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
      )} */}

      {bookingsData.length > 0 ? (
        <div className="space-y-4 justify-items-center mt-16">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 align-middle">
            My bookings
          </h1>
          {bookingsData.map((booking) => (
            <div
              key={booking.booking_id}
              className="flex items-center w-[80%] justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
            >
              {/* Car Image */}
              <img
                src={booking.car_cover_img_url}
                alt={booking.car_name}
                onClick={() => {
                  setSelectedBooking(booking);
                  isWhichScreen(booking, "View");
                  setModalOpen(true);
                }}
                className="w-20 h-20 object-cover rounded-md"
              />

              {/* Booking Details */}
              <div
                className="flex-1 ml-4"
                onClick={() => {
                  setSelectedBooking(booking);
                  isWhichScreen(booking, "View");
                  setModalOpen(true);
                }}
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {booking.car_name}
                </h2>
                <p className="text-sm text-gray-500">
                  ₹{booking.total_price} • {booking.start_date} -{" "}
                  {booking.end_date}
                </p>
                <p
                  className={`text-sm font-medium ${
                    booking.booking_status === "CANCELLED" ||
                    booking.booking_status === "FAILURE"
                      ? "text-red-600"
                      : booking.ride_status === "PENDING"
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {booking.booking_status === "CONFIRMED"
                    ? "Confirmed"
                    : booking.booking_status}
                </p>
              </div>

              {/* Review Button */}
              {booking.ride_status === "COMPLETED" && (
                <button
                  onClick={() => {
                    setSelectedBooking(booking);

                    isWhichScreen(booking, "RateNow");
                    setModalOpen(true);
                  }}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {booking.review_id ? "Edit Review" : "Rate & Review"}
                </button>
              )}

              {/* Ride Status */}
              {booking.ride_status !== "COMPLETED" && (
                <button
                  className={`px-6 py-4 font-medium ${
                    booking.ride_status === "CANCELLED"
                      ? "text-red-600"
                      : booking.ride_status === "NOT_STARTED"
                      ? "text-black"
                      : booking.ride_status === "ONGOING"
                      ? "text-orange-500"
                      : booking.ride_status === "COMPLETED"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {booking.ride_status}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No bookings found.</p>
      )}

      {/* {modalOpen && isWhichModal === "View" && selectedBooking && (
        <div
          className={`${
            isScreenSize ? "h-[90vh] pt-80 " : "h-[98vh] "
          } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
        >
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl flex flex-col md:flex-row relative">
            
            <button
              className="absolute top-0 right-3 to-black px-3 py-1 rounded-full text-lg hover:bg-as transition"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

           
            <div className="w-full md:w-1/2">
              <img
                src={selectedBooking.car_cover_img_url}
                alt={selectedBooking.car_name}
                className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
              />
            </div>

           
            <div className="w-full md:w-1/2 p-6 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedBooking.car_name}
              </h2>
              <p className="text-gray-700">
                <strong>Brand:</strong> {selectedBooking.brand}
              </p>
              <p className="text-gray-700">
                <strong>Model Year:</strong> {selectedBooking.model_year}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {selectedBooking.car_location}
              </p>
              <p className="text-gray-700">
                <strong>Start Date:</strong> {selectedBooking.start_date} (
                {selectedBooking.start_time})
              </p>
              <p className="text-gray-700">
                <strong>End Date:</strong> {selectedBooking.end_date} (
                {selectedBooking.end_time})
              </p>
              <p className="text-gray-900 font-semibold text-lg">
                <strong>Total Price:</strong> ₹{selectedBooking.total_price}
              </p>
              <p className="text-gray-700">
                <strong>Payment Mode:</strong> {selectedBooking.payment_mode}
              </p>
              <p className={`font-bold text-lg `}>
                Status:
                <strong
                  className={`${
                    selectedBooking.booking_status === "FAILURE" || selectedBooking.booking_status === "CANCELLED"
                      ? "text-red-600"
                      : selectedBooking.booking_status === "PENDING"
                      ? "text-amber-300"
                      : "text-green-600"
                  }`}
                >
                  {" "}
                  {selectedBooking.booking_status}{" "}
                </strong>
              </p>

     
              {selectedBooking.booking_status === "CONFIRMED" && (
                <button
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                  onClick={() =>
                    handleCancelBooking(selectedBooking.booking_id)
                  }
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )} */}

      {modalOpen && isWhichModal === "View" && selectedBooking && (
        <div
          className={`${
            isScreenSize ? "h-[90vh] pt-80 " : "h-[98vh] "
          } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
        >
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl flex flex-col md:flex-row relative">
            <button
              className="absolute top-0 right-3 to-black px-3 py-1 rounded-full text-lg hover:bg-gray-200 transition"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            <div className="w-full md:w-1/2">
              <img
                src={selectedBooking.car_cover_img_url}
                alt={selectedBooking.car_name}
                className="w-full h-[300px] md:h-full object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedBooking.car_name}
              </h2>
              <p className="text-gray-700">
                <strong>Brand:</strong> {selectedBooking.brand}
              </p>
              <p className="text-gray-700">
                <strong>Model Year:</strong> {selectedBooking.model_year}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {selectedBooking.car_location}
              </p>

              {/* MAP */}
              {selectedBooking && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  {/* <MapContainer
                    center={[17.385044, 78.486671]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[
                        selectedBooking.latitude,
                        selectedBooking.longitude,
                      ]}
                      icon={carIcon}
                    >
                      <Popup>{selectedBooking.car_name} Location</Popup>
                    </Marker>
                  </MapContainer> */}
                  {typeof window !== "undefined" && (
                    <MapContainer
                      center={location}
                      zoom={13}
                      style={{ height: "500px", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={location} icon={carIcon}>
                        <Popup>📍{selectedBooking.car_location}</Popup>
                      </Marker>
                      <FocusOnMarker position={location} />
                    </MapContainer>
                  )}
                </div>
              )}

              <p className="text-gray-700">
                <strong>Start Date:</strong> {selectedBooking.start_date} (
                {selectedBooking.start_time})
              </p>
              <p className="text-gray-700">
                <strong>End Date:</strong> {selectedBooking.end_date} (
                {selectedBooking.end_time})
              </p>
              <p className="text-gray-900 font-semibold text-lg">
                <strong>Total Price:</strong> ₹{selectedBooking.total_price}
              </p>
              <p className="text-gray-700">
                <strong>Payment Mode:</strong> {selectedBooking.payment_mode}
              </p>
              <p className="font-bold text-lg">
                Status:
                <strong
                  className={`${
                    selectedBooking.booking_status === "FAILURE" ||
                    selectedBooking.booking_status === "CANCELLED"
                      ? "text-red-600"
                      : selectedBooking.booking_status === "PENDING"
                      ? "text-amber-300"
                      : "text-green-600"
                  }`}
                >
                  {" "}
                  {selectedBooking.booking_status}{" "}
                </strong>
              </p>

              {selectedBooking.booking_status === "CONFIRMED" && (
                <button
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                  onClick={() =>
                    handleCancelBooking(selectedBooking.booking_id)
                  }
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {modalOpen && isWhichModal === "RateNow" && selectedBooking && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

            {/* Booking ID Input
          <input
            type="text"
            placeholder="Booking ID (Optional)"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
          /> */}

            {/* Rating Slider */}
            {/* <label className="block text-sm font-semibold mb-1">Rating: {rating}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full mb-3"
          /> */}

            {/* Star Rating */}
            <label className="block text-sm font-semibold mb-2">Rating:</label>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl cursor-pointer ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Comment TextArea */}
            <label className="block text-sm font-semibold mb-1">
              Comment (Max 200 chars)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength="200"
              className="w-full border p-2 rounded-md mb-3 h-20"
              placeholder="Write your review here..."
            ></textarea>

            {/* Submit Button */}
            <button
              onClick={() =>
                handleRatingSubmit(
                  selectedBooking.booking_id,
                  selectedBooking.review_id
                )
              }
              className="bg-[#121212] text-white px-4 py-2 rounded-md w-full hover:scale-105"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
