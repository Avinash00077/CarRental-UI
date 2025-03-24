import React, { useEffect, useState } from "react";
import axios from "axios";
import constants from "../config/constants";
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader/Loader";
import { getUserToken } from "../utils/getToken";
import {
  calculateDaysBetween,
  formatDateToYYYYMMDD,
  formatDateToYYYYMMDD2,
} from "../utils/dateUtils";
import { useScreenSize } from "../context/screenSizeContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BookRide = () => {
  const carIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png", // Car marker icon
    iconSize: [35, 35],
  });
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate");
  const carId = searchParams.get("carId");
  const endDate = searchParams.get("endDate");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const [isLoaderOpen, setLoaderOpen] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState('Please wait we are fetching the car details');
  const [carDetailsTab, setCarDetailsTab] = useState("Reviews");
  const [car, setCar] = useState([]);
  const [baseAmount, setBaseAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [rentalTaxAmount, setRentalTaxAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [selectedToTime, setSelectedToTime] = useState("12:00");
  const [selectedTime, setSelectedTime] = useState(startTime);
  const [avilableSlots, setAvilableSLots] = useState([]);
  const [filteredStartTimes, setFilteredStartTimes] = useState([]);
  const [filteredEndTimes, setFilteredEndTimes] = useState([]);
  const [filteredEndDates, setFilteredEndDates] = useState([]);
  const [location, setLocation] = useState([17.385044, 78.486671]);
  const [tACValue, setTACValue] = useState(false);
  const [openTAC, setOpenTAc] = useState(false);
  const isScreenSize = useScreenSize().isScreenSmall;

  const gstRate = 0.18; // 18% GST
  const rentalTaxRate = 0.05; // 5% Rental Tax

  useEffect(() => {
    if (!car.length > 0) {
      getCar();
    }
    setSelectedDate(formatDateToYYYYMMDD2(startDate));
    // setSelectedTime(startTime);
    // setSelectedToDate(formatDateToYYYYMMDD2(endDate));
    // setSelectedToTime(endTime);
    if (selectedDate) {
      const startTimeSlots = avilableSlots.filter((i) => {
        if (i.available_date === formatDateToYYYYMMDD2(selectedDate)) return i;
      });
      setFilteredStartTimes(startTimeSlots[0]?.time_slots);
    }
    // if(selectedDate && selectedTime){
    //     fetchBookingSlots()
    // }
    if (startDate && endDate && startTime && endTime) {
      const duration = calculateDaysBetween(startDate, endDate);
      setTotalDays(duration);
      let rent = car[0]?.daily_rent;
      const rentPerDay = parseFloat(rent);

      const totalRent = parseFloat(rentPerDay * duration);
      const gstAmount = parseFloat(totalRent * gstRate);
      const rentalTax = parseFloat(totalRent * rentalTaxRate);
      const totalPayable = parseFloat(totalRent + gstAmount + rentalTax);
      setBaseAmount(totalRent);
      setGstAmount(gstAmount);
      setRentalTaxAmount(rentalTax);
      setTotalAmount(totalPayable);
    }
  }, [selectedDate, selectedToDate, selectedTime, selectedToTime, car]);

  const getStartSlots = async (e) => {
    setSelectedDate(e.target.value);
    const startTimeSlots = avilableSlots.filter((i) => {
      if (i.available_date === formatDateToYYYYMMDD2(selectedDate)) return i;
    });
    setFilteredStartTimes(startTimeSlots[0].time_slots);
  };
  const getEndSlots = (e) => {
    const newSelectedToDate = e.target.value; // Get new selected end date
    setSelectedToDate(newSelectedToDate);
    const startTimeSlots = filteredEndDates.filter(
      (i) => i.available_date === formatDateToYYYYMMDD2(newSelectedToDate)
    );
    if (startTimeSlots.length > 0) {
      setFilteredEndTimes(startTimeSlots[0].time_slots);
    } else {
      setFilteredEndTimes([]); // Clear end times if no match
    }
  };
  const fetchBookingSlots = async (e) => {
    try {
      setSelectedTime(e.target.value);
      const response = await axios.get(
        `${constants.API_BASE_URL}/user/bookings/slots-start-date`,
        {
          headers: {
            start_date: formatDateToYYYYMMDD(selectedDate),
            start_time: selectedTime,
            car_id: carId,
            Authorization: `Bearer ${getUserToken()}`,
          },
        }
      );
      setFilteredEndDates(response.data.data);
      // setOpenToDateInputs(true);
    } catch (error) {
      console.error(
        "Error fetching booking slots:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const getCar = async () => {
    try {
      const response = await axios.get(
        `${constants.API_BASE_URL}/user/car/id`,
        {
          headers: {
            "Content-Type": "application/json",
            car_id: carId,
            start_date: startDate,
            end_date: endDate,
            start_time: startTime,
            end_time: endTime,
            Authorization: `Bearer ${getUserToken()}`,
          },
        }
      );
      setCar(response.data.data);
      setAvilableSLots(response.data.data[0].available_slots);
      console.log(
        response.data.data[0].latitude,
        response.data.data[0].longitude
      );
      setLocation([
        response.data.data[0].latitude,
        response.data.data[0].longitude,
      ]);
      console.log(location);
      setLoaderOpen(false);
      setLoaderMessage(null)
    } catch (error) {
      console.log(error);
    }
  };

  const FocusOnMarker = ({ position }) => {
    const map = useMap();

    // Adjust latitude slightly to move the marker higher in view
    const adjustedPosition = [position[0] - 0.026, position[1]]; // Shift upwards

    map.setView(position, 13, { animate: true });

    return null;
  };

  const handleAcceptButton = (value) => {
    setOpenTAc(false);
    value == "accept" ? setTACValue(true) : setTACValue(false);
  };
  // Function to dynamically load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const updateBookingStatus = async (booking_id, transaction_id) => {
    const payload = {
      booking_id: booking_id,
      booking_status: "CONFIRMED",
      transaction_id: transaction_id,
    };
    try {
      const response = await axios.put(
        `${constants.API_BASE_URL}/user/booking`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUserToken()}`,
          },
        }
      );

      if (response.data) {
        console.log("Booking update successful!");
        return true;
      } else {
        console.error(
          "Booking update failed: Invalid response format",
          response
        );
      }
    } catch (error) {
      console.error("Error while booking update:", error);
    }
  };

  // Function to start the Razorpay payment process
  const startRazorpayPayment = async (bookingId, amount) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    console.log(userDetails);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      console.error("Failed to load Razorpay script");
      return;
    }

    const options = {
      key: "rzp_test_tmfpOEiEDlAApc",
      amount: amount * 100,
      currency: "INR",
      name: "Car Rental Service",
      description: "Booking Payment",
      image: "/logo.png",
      handler: async function (response) {
        console.log("Payment Successful:", response);
        setLoaderMessage('Hurrah payment sucessfull we are updating your booking')
        setLoaderOpen(true);
        await updateBookingStatus(bookingId, response.razorpay_payment_id);
        setLoaderOpen(false);
        setLoaderMessage(null)
        window.location.href = "/bookings";
      },
      prefill: {
        name: userDetails.email.split("@")[0],
        email: userDetails.email,
        contact: userDetails.phone_number,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Function to handle the booking API call
  const postBooking = async () => {
    setLoaderMessage('Please wait we are Initiating booking...')
    setLoaderOpen(true);
    console.log("Initiating booking...");

    const payload = {
      car_id: carId,
      start_date: formatDateToYYYYMMDD(startDate),
      end_date: formatDateToYYYYMMDD(endDate),
      start_time: startTime || "10:00",
      end_time: endTime || "11:00",
      payment_mode: "ONLINE",
      total_price: totalAmount,
    };

    try {
      const response = await axios.post(
        `${constants.API_BASE_URL}/user/booking`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUserToken()}`,
          },
        }
      );

      if (response.data) {
        console.log(
          "Booking successful! Opening Razorpay...",
          response.data.data
        );
        setLoaderOpen(false);
        setLoaderMessage(null)
        startRazorpayPayment(response.data.data.booking_id, totalAmount);
      } else {
        console.error("Booking failed: Invalid response format", response);
      }
    } catch (error) {
      console.error("Error while booking:", error);
    }
  };
  return (
    <div className="  space-y-3  mt-[65px]">
      {isLoaderOpen && <Loader message={loaderMessage} />}
      {car.length > 0 && (
        <div>
          {/* Nav Bar Comes Here */}
          {/* <div className="bg-gray-100 fixed h-20 flex items-center px-4 space-x-4 rounded-lg shadow-md">

            <div className="bg-white px-4 py-2 rounded-lg flex flex-col">
              <label className="text-sm font-semibold">Start Date</label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  getStartSlots(e);
                }}
                className="text-gray-900 outline-none"
              >
                <option value="">Select Start Date</option>
                {avilableSlots.map((slot) => (
                  <option key={slot.available_date} value={slot.available_date}>
                    {slot.available_date}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg flex flex-col">
              <label className="text-sm font-semibold">Start Time</label>
              <select
                value={selectedTime}
                onChange={(e) => {
                  fetchBookingSlots(e);
                }}
                className="text-gray-900 outline-none"
              >
                <option value="">Select Start Time</option>
                {filteredStartTimes?.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg flex flex-col">
              <label className="text-sm font-semibold">End Date</label>
              <select
                value={selectedToDate}
                onChange={(e) => {
                  getEndSlots(e);
                }}
                className="text-gray-900 outline-none"
                disabled={!selectedDate}
              >
                <option value="">Select End Date</option>
                {filteredEndDates.map((date) => (
                  <option key={date.available_date} value={date.available_date}>
                    {date.available_date}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg flex flex-col">
              <label className="text-sm font-semibold">End Time</label>
              <select
                value={selectedToTime}
                onChange={(e) => setSelectedToTime(e.target.value)}
                className="text-gray-900 outline-none"
                disabled={!selectedToDate}
              >
                <option value="">Select End Time</option>
                {filteredEndTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div> */}
          {/*Cars Content comes here */}
          <div className="w-full flex justify-center   p-2 ">
            {/*car Image review comes here */}
            <div className="w-[70%]  p-4 flex flex-col mr-3 shadow-2xl rounded-3xl">
              <div>
                <img
                  src={car[0].car_cover_img_url}
                  className="w-[60%] h-[300px] rounded-lg object-cover"
                ></img>
              </div>
              <div className="py-2">
                <h1 className="text-lg font-medium">
                  {car[0].name} {car[0].model_year}
                </h1>
                <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 justify-between items-center pt-2 space-y-2">
                  <h1>
                    Loaction :{" "}
                    <span className="space-x-3 pl-2">{car[0].location}</span>
                  </h1>
                  <h1>
                    Milage:
                    <span className="space-x-3 pl-2">{car[0].mileage}</span>
                  </h1>
                  <h1>
                    Car Condition:{" "}
                    <span className="space-x-3pl-2">
                      {car[0].car_condition}
                    </span>
                  </h1>
                  <h1>
                    car Type:{" "}
                    <span className="space-x-3 pl-2">{car[0].car_type}</span>
                  </h1>
                  <h1>
                    {" "}
                    Fastag Availability :
                    <span className="space-x-3 pl-2">
                      {car[0].fastag_availability}
                    </span>{" "}
                  </h1>
                </div>
                <h1>
                  Description:
                  <span className="space-x-3">{car[0].description}</span>{" "}
                </h1>
              </div>
              {/* Car Tabs Section */}
              <div className="flex flex-col ">
                <div className="flex bg-gray-100 space-x-3 px-5 rounded-b-md shadow-2xl">
                  {["Location", "Reviews"].map((x) => (
                    <div
                      className={`${
                        carDetailsTab == x && " underline  "
                      } p-2 rounded-l text-[16px] font-semibold cursor-pointer hover:-translate-y-0.5 hover:text-medium`}
                      onClick={() => setCarDetailsTab(x)}
                    >
                      {x}
                    </div>
                  ))}
                </div>
                {carDetailsTab == "Reviews" && (
                  <div className="flex  w-full overflow-scroll no-scrollbar">
                    {car[0].car_reviews?.length > 0 ? (
                      car[0].car_reviews.map((review, index) => (
                        <div
                          key={index}
                          className="p-4 flex w-full flex-col border-b bg-gray-100 rounded-lg shadow-2xl m-3   border-gray-300"
                        >
                          <div className="flex flex-col  w-72 gap-3">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <img
                                    src={review.profile_img_url}
                                    alt={review.user_name}
                                    className="w-10 h-10 mb-2 rounded-full"
                                  />
                                  <p className="font-semibold">
                                    {review.user_name}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {review.created_at}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-yellow-500">
                            ⭐ {review.rating}/5
                          </p>
                          <p className="mt-1">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="mt-4 text-gray-500">No reviews yet.</p>
                    )}
                  </div>
                )}
                {carDetailsTab === "Location" && (
                  <div>
                    {" "}
                    {typeof window !== "undefined" && (
                      <MapContainer
                        center={location}
                        zoom={13}
                        style={{ height: "300px", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={location} icon={carIcon}>
                          <Popup>📍{car.location}</Popup>
                        </Marker>
                        <FocusOnMarker position={location} />
                      </MapContainer>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/*apyment info comes here */}
            <div className="w-[30%]  shadow-2xl rounded-4xl py-3 ">
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                Payment Details
              </h2>
              {totalDays >= 0 && (
                <div
                  className={`mt-4 text-start w-full bg-white p-4 rounded-lg`}
                  style={
                    isScreenSize ? { marginTop: "20px" } : { marginTop: "5px" }
                  }
                >
                  <div className="flex justify-between items-start space-y-3">
                    <p
                      className="font-semibold text-sm "
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-1">
                        From Date:{" "}
                      </span>
                      {startDate}
                    </p>
                    <p
                      className="font-semibold text-sm "
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-3">
                        StartTime:{" "}
                      </span>
                      {startTime}
                    </p>
                  </div>
                  <div className="flex justify-between items-start space-y-3 pr-12">
                  <p
                      className="font-semibold text-sm"
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-1">
                        {" "}
                        To Date :{" "}
                      </span>
                      {endDate}
                    </p>
                    <p
                      className="font-semibold text-sm"
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-3 pl-7">
                        {" "}
                        End Time :{" "}
                      </span>
                      {endTime}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pr-10">
                    <p
                      className="font-semibold text-lg"
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-3">
                        Total Days :
                      </span>
                      {totalDays}
                    </p>
                    <p
                      className="font-semibold text-lg"
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-3">
                        Base Rent:
                      </span>
                      {baseAmount}
                    </p>
                  </div>
                  <div className="flex justify-between items-center space-y-3 pr-10">
                    <p
                      className="font-semibold text-lg pt-4"
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-3">
                        GST (18%):{" "}
                      </span>
                      {gstAmount}
                    </p>
                    <p
                      className="font-semibold text-lg"
                      style={
                        isScreenSize
                          ? { marginTop: "5px" }
                          : { marginTop: "5px" }
                      }
                    >
                      <span className="text-[16px] text-gray-700 px-3">
                        {" "}
                        Rental Tax :{" "}
                      </span>
                      {rentalTaxAmount}
                    </p>
                  </div>
                  <p
                    className="font-semibold text-lg text-gray-700 py-4 dark:text-blue-400"
                    style={
                      isScreenSize ? { marginTop: "5px" } : { marginTop: "5px" }
                    }
                  >
                    Total Rent: ₹{totalAmount.toFixed(2)}
                  </p>
                  <div className="flex" style={{ padding: "5px 10px" }}>
                    {" "}
                    <input
                      type="checkbox"
                      checked={tACValue}
                      onChange={() => setOpenTAc(true)}
                      className="cursor-pointer  w-4 h-4 border-2 border-gray-500 rounded-lg accent-black"
                    ></input>{" "}
                    <label style={{ paddingLeft: "5px" }}>
                      Terms and conditions
                    </label>{" "}
                  </div>
                </div>
              )}
              <div
                className="mt-6"
                style={{ padding: "10px", paddingTop: "20px" }}
              >
                <button
                  onClick={tACValue && postBooking}
                  style={{ padding: "7px" }}
                  className={`w-full text-white p-2 text-lg ${
                    tACValue
                      ? "bg-black font-medium border-[#121212] rounded-lg  hover:text-white hover:bg-[#121212] hover:border-[#121212] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                      : " text-gray-700 bg-gray-100   disabled cursor-not-allowed"
                  }`}
                >
                  Procced To Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {openTAC && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
          <div className="lg:w-2xl h-[60vh] bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
              Terms and Conditions
            </h2>
            <div className="overflow-y-auto text-gray-700 px-4 h-[45vh]">
              <p>
                Welcome to DND Rental's online car rental service. By using our
                website and renting a vehicle or using any of the Platforms, you
                agree to be bound by these Terms and Conditions. Please read
                them carefully before making a booking.
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>
                  <strong>Eligibility:</strong> Minimum age required; valid
                  driver’s license and ID needed.
                </li>
                <li>
                  <strong>Bookings & Payment:</strong> Subject to availability;
                  full/partial payment required; prices may change.
                </li>
                <li>
                  <strong>Vehicle Usage:</strong> Only authorized drivers;
                  lawful use only; no drinking & smoking or reckless driving.
                </li>
                <li>
                  <strong>Insurance & Liability:</strong> Basic insurance
                  included; renter liable for damages not covered.
                </li>
                <li>
                  <strong>Cancellations & Refunds:</strong> Must cancel within
                  1hr before picking the car; cancellation fees apply.
                </li>
                <li>
                  <strong>Late Returns:</strong> Additional charges for late
                  returns; unauthorized extensions may lead to legal action.
                </li>
                <li>
                  <strong>Breakdown Assistance:</strong> Report mechanical
                  issues immediately; 24/7 roadside assistance available.
                </li>
                <li>
                  <strong>Privacy Policy:</strong> Personal data collected for
                  booking; not shared except as required by law.
                </li>
                <li>
                  <strong>Governing Law:</strong> Disputes resolved via
                  mediation/arbitration under applicable jurisdiction.
                </li>
                <li>
                  <strong>Amendments:</strong> DND Rentals reserves the right to
                  modify terms anytime.
                </li>
              </ul>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => handleAcceptButton("reject")}
              >
                Reject
              </button>
              <button
                className="bg-black text-white px-6 py-2 rounded-lg  transition"
                onClick={() => handleAcceptButton("accept")}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BookRide;
