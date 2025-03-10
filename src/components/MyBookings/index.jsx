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
import bored from "../../assets/bored.gif";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const MyBookings = () => {
  const [loaderOpen, setLoaderOpen] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState(null);
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
        setLoaderMessage("Please wait we are fetching your bookings");
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
          setLoaderOpen(false);
          setLoaderMessage(null);
          setModalOpen(false);
        }
      } catch (error) {
        console.error(error);
        // setModalOpen(true);
        // setModalFailureMessage(
        //   error.response?.data?.message || "Something went wrong"
        // );
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
      setLoaderMessage("Please wait we are cancelling your booking");
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
      setLoaderMessage(null);
      setLoaderOpen(false);
      //location.reload();
    } catch (error) {
      console.error(error);
      setLoaderMessage(null);
      setLoaderOpen(false);
      // setModalOpen(true);
      // setModalFailureMessage(
      //   error.response?.data?.message || "Something went wrong"
      // );

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

  const generateInvoice = (booking) => {
    const doc = new jsPDF();
  
    // **Set Font for Unicode Support**
    doc.setFont("helvetica", "bold");
  
    // **Header**
    doc.setFontSize(22);
    doc.text("Car Rental Invoice", 14, 20);
  
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 28);
  
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(`Booking ID: #${booking.booking_id}`, 14, 36);
  
    // **Billing Information**
    const userDetails = [
      ["Name:", booking.name],
      ["Email:", booking.user_email],
      ["Phone:", booking.user_phone_number],
      ["Payment Mode:", booking.payment_mode],
      ["Booking Status:", booking.booking_status],
      ["Transaction ID:", booking.transaction_id ? booking.transaction_id : "N/A"],
    ];
  
    autoTable(doc, {
      head: [["Details", "Information"]],
      body: userDetails,
      startY: 45,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 },
      font: "helvetica",
    });
  
    // **Rental Details & Pricing**
    const gstRate = 0.18;
    const rentalTaxRate = 0.05;
    const totalPayable = parseFloat(booking.total_price); // Get from API
  
    // Reverse Calculation for Accuracy
    const baseRent = totalPayable / (1 + gstRate + rentalTaxRate);
    const gstAmount = baseRent * gstRate;
    const rentalTax = baseRent * rentalTaxRate;
  
    const pricingDetails = [
      ["Car:", booking.car_name],
      ["Brand:", booking.brand],
      ["Start Date:", `${booking.start_date} (${booking.start_time})`],
      ["End Date:", `${booking.end_date} (${booking.end_time})`],
      ["Base Rent:", `₹${baseRent.toFixed(2)}`],
      ["GST (18%):", `₹${gstAmount.toFixed(2)}`],
      ["Rental Tax (5%):", `₹${rentalTax.toFixed(2)}`],
      ["Total Payable:", `₹${totalPayable.toFixed(2)}`],
    ];
  
    autoTable(doc, {
      head: [["Rental Details", "Amount"]],
      body: pricingDetails,
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 70,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [26, 188, 156], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 },
      font: "helvetica",
    });
  
    // **Footer Message**
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(
      "Thank you for choosing our car rental service! Safe travels!",
      14,
      doc.lastAutoTable.finalY + 15
    );
  
    // **Save the PDF**
    doc.save(`Invoice_${booking.booking_id}.pdf`);
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
    setLoaderMessage(
      "Please wait while we are submitting your rating for booking"
    );
    setLoaderOpen(true);
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
      setLoaderMessage(null);
      getUserBookings();
    } catch (error) {
      console.error(error);
      // setModalOpen(true);
      // setModalFailureMessage(
      //   error.response?.data?.message || "Something went wrong"
      // );
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
      {loaderOpen && <Loader message={loaderMessage} />}

      {/* {modalOpen && (
        <Modal
          typeOfModal="failure"
          message={modalFailureMessage}
          closeModal={() => setModalOpen(false)}
        />
      )} */}

      {bookingsData.length > 0 ? (
        <div className="space-y-4 justify-items-center mt-16">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mt-20 align-middle">
            My bookings
          </h1>
          {bookingsData.map((booking) => (
            <div
              key={booking.booking_id}
              className={
                !isScreenSize
                  ? `flex items-center w-[80%] justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4`
                  : `flex items-center w-full justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4`
              }
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
                  <div className="flex gap-1 mb-3">
                    {booking.ride_status === "COMPLETED" &&
                      [1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg cursor-pointer ${
                            booking.rating >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                  </div>
                </h2>
                <p className="text-sm text-gray-500">
                  ₹{booking.total_price} • {booking.start_date} -{" "}
                  {booking.end_date}
                </p>
                <p
                  className={`text-sm font-medium ${
                    booking?.booking_status === "CONFIRMED" ||
                    booking?.booking_status === "COMPLETED"
                      ? "text-green-600"
                      : booking?.booking_status === "PENDING"
                      ? "text-amber-300"
                      : " text-red-600"
                  }`}
                >
                  {booking.booking_status === "CONFIRMED"
                    ? "Confirmed"
                    : booking.booking_status}
                </p>
              </div>

              {/* Review Button */}
              {booking.ride_status === "COMPLETED" &&
                booking.booking_status === "COMPLETED" && (
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
                    booking.ride_status === " COMPLETED"
                      ? "text-green-600"
                      : booking.ride_status === "NOT_STARTED"
                      ? "text-black"
                      : booking.ride_status === "ONGOING"
                      ? "text-orange-500"
                      : "text-red-600"
                  }`}
                >
                  {booking.ride_status}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-screen  flex justify-center items-center">
          <h1 className="font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white mt-20 flex items-center gap-2">
            No Bookings Found
            <img src={bored} className="h-10 w-10" alt="No Bookings" />
          </h1>
        </div>
      )}

      {modalOpen && isWhichModal === "View" && selectedBooking && (
        <div
          className={`  ${
            isScreenSize ? "bg-white" : "h-[98vh] mt-10  "
          } no-scrollbar overflow-y-auto  w-full  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 fixed inset-0 flex justify-center items-center z-50 bg-opacity-40`}
        >
          <div className=" bg-opacity-90 lg:bg-white  lg:mt-0 p-6 lg:border lg:border-gray-300    lg:rounded-lg lg:shadow-xl w-full lg:w-11/12 h-full lg:h-[540px] max-w-4xl flex flex-col md:flex-row relative">
            <button
              className="absolute top-0 right-3 to-black px-3  py-1  rounded-full text-lg hover:bg-gray-200 transition"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            <div className="w-full md:w-1/2">
              <div>
                <img
                  src={selectedBooking.car_cover_img_url}
                  alt={selectedBooking.car_name}
                  className="w-full h-[44] lg:h-[240px]  mt-3 lg:mt-0 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="my-4 space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedBooking.car_name}
                </h2>
                <div className="flex lg:flex-col space-x-5">
                  <p className="text-gray-700">
                    <strong>Brand:</strong> {selectedBooking.brand}
                  </p>
                  <p className="text-gray-700">
                    <strong>Model Year:</strong> {selectedBooking.model_year}
                  </p>
                </div>
                <p className="text-gray-700 ">
                  <strong>Car Description:</strong>{" "}
                  <span className="text-center">
                    {selectedBooking.model_year} Helloejeeeeeeeeeeeeee
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:p-6 lg:pt-0  space-y-3">
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
              <p className="text-gray-900 font-semibold text-md">
                <strong>Total Price:</strong> ₹{selectedBooking.total_price}
              </p>
              <p className="text-gray-700">
                <strong>Payment Mode:</strong> {selectedBooking.payment_mode}
              </p>
              <p className="font-bold text-sm">
                Status:
                <strong
                  className={`${
                    selectedBooking.booking_status === "CONFIRMED" ||
                    selectedBooking.booking_status === "COMPLETED"
                      ? "text-green-600"
                      : selectedBooking.booking_status === "PENDING"
                      ? "text-amber-300"
                      : " text-red-600"
                  }`}
                >
                  {" "}
                  {selectedBooking.booking_status}{" "}
                </strong>
              </p>
              {selectedBooking && (
                <button
                  className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md font-semibold hover:scale-105 transition"
                  onClick={() => generateInvoice(selectedBooking)}
                >
                  Download Invoice
                </button>
              )}

              {selectedBooking.booking_status === "CONFIRMED" &&
                selectedBooking.ride_status === "NOT_STARTED" && (
                  <button
                    className="mt-4 mb-3 lg:mb-0 w-full bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
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
