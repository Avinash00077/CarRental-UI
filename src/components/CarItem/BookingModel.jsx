import React, { useState, useEffect } from "react";
import axios from "axios";
import constants from "../../config/constants";
import Loader from "../../components/Loader/Loader";
import { Calendar } from "primereact/calendar";
import { FaArrowLeft } from "react-icons/fa6";
import { Star } from "lucide-react";
import "primereact/resources/primereact.min.css";
import {
  calculateDaysBetween,
  parseDate,
  formatDateToYYYYMMDD,
} from "../../utils/dateUtils";
import { useScreenSize } from "../../context/screenSizeContext";
import "primereact/resources/themes/lara-light-blue/theme.css";

const BookingModel = ({ car, closeModal, userSelectedDates }) => {
  console.log(car, "ooooooooooooooooooooo");
  const [baseAmount, setBaseAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [rentalTaxAmount, setRentalTaxAmount] = useState(0);
  const [tACValue, setTACValue] = useState(false);
  const [openTAC, setOpenTAc] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const token = localStorage.getItem("authToken");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [selectedToTime, setSelectedToTime] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoaderOpen, setLoaderOpen] = useState(false);
  const [selectedTodatesInfo, setSelectedTodatesInfo] = useState([]);
  const [openToDateInputs, setOpenToDateInputs] = useState(false);
  const gstRate = 0.18; // 18% GST
  const rentalTaxRate = 0.05; // 5% Rental Tax
  // Function to calculate total days and amount
  // const calculateDaysBetween = (fromDate, toDate) => {
  //   if (!fromDate || !toDate) return 0;

  //   const from = new Date(fromDate);
  //   const to = new Date(toDate);

  //   const differenceInTime = to.getTime() - from.getTime(); // Difference in milliseconds
  //   const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert to days

  //   console.log(
  //     differenceInDays,
  //     differenceInTime,
  //     "' Calculated duration is '"
  //   ); // Debug log
  //   return differenceInDays;
  // };

  console.log(car, "car info is ");
  const isScreenSize = useScreenSize().isScreenSmall;
  const [startDate, setStartDate] = useState(
    isScreenSize ? "2025/02/26" : parseDate(userSelectedDates?.fromDate) || ""
  );
  const [endDate, setEndDate] = useState(
    isScreenSize
      ? "2025/02/27"
      : parseDate(userSelectedDates?.dropOffDate) || ""
  );
  const timeSlots = selectedDate
    ? car.available_slots.find((slot) => slot.available_date === selectedDate)
        ?.time_slots || []
    : [];
  console.log(selectedTodatesInfo);
  const toDateSlots = selectedToDate
    ? selectedTodatesInfo.find((slot) => slot.available_date === selectedToDate)
        ?.time_slots || []
    : [];

  useEffect(() => {
    if (selectedDate && selectedToDate && selectedToTime) {
      const duration = calculateDaysBetween(selectedDate, selectedToDate);
      console.log(duration, " Caliculated duration is ");
      setTotalDays(duration);
      const rentPerDay = parseFloat(car.daily_rent);

      const totalRent = parseFloat(rentPerDay * duration);
      const gstAmount = parseFloat(totalRent * gstRate);
      const rentalTax = parseFloat(totalRent * rentalTaxRate);
      const totalPayable = parseFloat(totalRent + gstAmount + rentalTax);
      setBaseAmount(totalRent);
      setGstAmount(gstAmount);
      setRentalTaxAmount(rentalTax);
      setTotalAmount(totalPayable);
    }
  }, [selectedDate, selectedToDate, selectedToTime]);

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
            Authorization: `Bearer ${token}`,
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

  const handleAcceptButton = (value) => {
    setOpenTAc(false);
    value == "accept" ? setTACValue(true) : setTACValue(false);
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
        setLoaderOpen(true);
        await updateBookingStatus(bookingId, response.razorpay_payment_id);
        setLoaderOpen(false);
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
    setLoaderOpen(true);
    console.log("Initiating booking...");

    const payload = {
      car_id: carInfo[0].car_id,
      start_date: formatDateToYYYYMMDD(startDate),
      end_date: formatDateToYYYYMMDD(endDate),
      start_time: userSelectedDates.start_time || "10:00",
      end_time: userSelectedDates.end_time || "11:00",
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        console.log(
          "Booking successful! Opening Razorpay...",
          response.data.data
        );
        setLoaderOpen(false);
        startRazorpayPayment(response.data.data.booking_id, totalAmount);
      } else {
        console.error("Booking failed: Invalid response format", response);
      }
    } catch (error) {
      console.error("Error while booking:", error);
    }
  };
  const fetchBookingSlots = async (startTime) => {
    try {
      const response = await axios.get(
        `${constants.API_BASE_URL}/user/bookings/slots-start-date`,
        {
          headers: {
            start_date: formatDateToYYYYMMDD(selectedDate),
            start_time: startTime ? startTime : selectedTime,
            car_id: carInfo[0].car_id,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data, "Helleoeeeeeeeeee");
      setSelectedTodatesInfo(response.data.data);
      setOpenToDateInputs(true);
    } catch (error) {
      console.error(
        "Error fetching booking slots:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const selectedFromTime = (e) => {
    setSelectedTime(e.target.value);
    fetchBookingSlots(e.target.value);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={` flex items-center justify-center  bg-white rounded-lg shadow-xl ${
          isScreenSize ? "w-[100%] h-[100vh] flex-col" : "w-[70%] "
        }  p-6 space-y-6 relative`}
      >
        {/* Close Button */}
        {isLoaderOpen && <Loader />}
        <div
          className={`${
            isScreenSize
              ? "w-full h-[240px] relative"
              : "w-1/2 h-[500px] rounded-lg"
          }  rounded-r-none relative`}
        >
          {isScreenSize && (
            <FaArrowLeft
              className=" absolute text-black text-3xl z-[9999]  p-1 rounded-full"
              style={
                isScreenSize
                  ? { color: "black", marginTop: "10px" }
                  : { color: "black" }
              }
            />
          )}
          <img
            src={carInfo[0].car_cover_img_url}
            className={`w-full h-full ${
              !isScreenSize && "rounded-lg"
            } rounded-r-none object-fit`}
            alt="Car"
          />
        </div>

        <div
          className={`${
            isScreenSize ? "w-full overflow-y-scroll" : " w-1/2 "
          } h-full`}
        >
          <div>
            {!isScreenSize && (
              <div>
                {" "}
                <button
                  className=" bg-wh text-gray-600 hover:text-gray-900 cursor-pointer dark:hover:text-gray-300 text-2xl"
                  onClick={closeModal}
                >
                  <FaArrowLeft
                    className="text-3xl"
                    style={
                      isScreenSize
                        ? {}
                        : {
                            color: "black",
                            marginTop: "-30px",
                            paddingLeft: "10px",
                          }
                    }
                  />
                </button>
              </div>
            )}
          </div>
          <div className="text-center">
            <div
              className={`flex ${
                !isScreenSize ? "flex-col" : "space-x-6"
              } justify-ceneter items-center`}
            >
              <h2 className="text-2xl font-bold" style={{ padding: "10px" }}>
                {carInfo[0].name}
              </h2>
              <p className="text-gray-500 text-[20px] dark:text-gray-400">
                {carInfo[0].brand} - {carInfo[0].model_year}
              </p>
            </div>
            <p className="text-[16px] text-gray-600 dark:text-gray-300 mt-2">
              {carInfo[0].description}
            </p>
            <p className="text-[20px] items-end text-gray-500 dark:text-gray-400">
              {carInfo[0].location}
            </p>
          </div>

          {/* Booking Form */}
          <div
            className="space-y-4 bg-white p-4 rounded-lg"
            style={{ padding: "0px 10px" }}
          >
            <div>
              <label className="block text-medium " style={{ padding: "10px" }}>
                Booking Start Date
              </label>
              <div className=" flex space-x-4  justify-between items-center ">
                <div className="w-1/2">
                  <label className="block ">Select Date:</label>
                  <select
                    className="border p-2 w-full h-10 rounded-lg"
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(""); // Reset time when date changes
                    }}
                    value={selectedDate}
                  >
                    <option value="">Select a date</option>
                    {carInfo[0].available_slots.map((slot) => (
                      <option
                        key={slot.available_date}
                        value={slot.available_date}
                      >
                        {slot.available_date}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  {selectedDate && (
                    <>
                      <label className="block ">Select Time Slot:</label>
                      <select
                        className="border p-2 w-full h-10 rounded-lg"
                        onChange={(e) => selectedFromTime(e)}
                        value={selectedTime}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>
              {openToDateInputs && (
                <div className=" flex space-x-4  mt-4 justify-between items-center ">
                  <div className="w-1/2">
                    <label className="block ">Select To Date:</label>
                    <select
                      className="border p-2 w-full h-10 rounded-lg"
                      onChange={(e) => {
                        setSelectedToDate(e.target.value);
                        setSelectedToTime(""); // Reset time when date changes
                      }}
                      value={selectedToDate}
                    >
                      <option value="">Select a date</option>
                      {selectedTodatesInfo.map((slot) => (
                        <option
                          key={slot.available_date}
                          value={slot.available_date}
                        >
                          {slot.available_date}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    {openToDateInputs && selectedDate && (
                      <>
                        <label className="block ">Select Time Slot:</label>
                        <select
                          className="border p-2 w-full h-10 rounded-lg"
                          onChange={(e) => setSelectedToTime(e.target.value)}
                          value={selectedToTime}
                        >
                          <option value="">Select a time</option>
                          {toDateSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Total Days and Total Amount */}
          {totalDays > 0 && (
            <div
              className={`mt-4 text-center bg-white p-4 rounded-lg`}
              style={
                isScreenSize ? { marginTop: "20px" } : { marginTop: "5px" }
              }
            >
              <p
                className="font-semibold text-lg"
                style={
                  isScreenSize ? { marginTop: "5px" } : { marginTop: "5px" }
                }
              >
                Total Days: {totalDays}
              </p>
              <p
                className="font-semibold text-lg"
                style={
                  isScreenSize ? { marginTop: "5px" } : { marginTop: "5px" }
                }
              >
                Base Rent: {baseAmount}
              </p>
              <p
                className="font-semibold text-lg"
                style={
                  isScreenSize ? { marginTop: "5px" } : { marginTop: "5px" }
                }
              >
                GST (18%): {gstAmount}
              </p>
              <p
                className="font-semibold text-lg"
                style={
                  isScreenSize ? { marginTop: "5px" } : { marginTop: "5px" }
                }
              >
                Rental Tax : {rentalTaxAmount}
              </p>
              <p
                className="font-semibold text-lg text-[#121212] dark:text-blue-400"
                style={
                  isScreenSize ? { marginTop: "5px" } : { marginTop: "5px" }
                }
              >
                Total Rent: ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex" style={{ padding: "5px 10px" }}>
            {" "}
            <input
              type="checkbox"
              checked={tACValue}
              onChange={() => setOpenTAc(true)}
              className="cursor-pointer appearance-none w-5 h-5 border-2 border-gray-500 rounded-sm checked:bg-black checked:border-black checked:ring-2 checked:ring-black focus:ring-black"
            ></input>{" "}
            <label style={{ paddingLeft: "5px" }}>Terms and conditions</label>{" "}
          </div>
          {openTAC && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="lg:w-2xl h-[60vh]  bg-gray-100">
                <div>content here</div>
                <div className="flex justify-end space-x-10">
                  <button
                    className="bg-blue-500 rounded-lg cursor-pointer "
                    style={{ padding: "7px 20px", margin: "0px 10px" }}
                    onClick={() => handleAcceptButton("reject")}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-green-600 rounded-lg cursor-pointer  "
                    style={{ padding: "7px 20px", margin: "0px 10px" }}
                    onClick={() => handleAcceptButton("accept")}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6" style={{ padding: "10px", paddingTop: "20px" }}>
            <button
              onClick={tACValue && postBooking}
              style={{ padding: "7px" }}
              className={`w-full text-white p-2 text-lg ${
                tACValue
                  ? "bg-[#121212] font-medium border-[#121212] rounded-lg  hover:text-white hover:bg-[#121212] hover:border-[#121212] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                  : " text-gray-700 bg-gray-100   disabled cursor-not-allowed"
              }`}
            >
              Procced To Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="max-w-5xl mx-auto p-4">
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //       <div>
  //         <img src="/car-image.jpg" alt="Car" className="rounded-lg w-full h-72 object-cover" />
  //       </div>
  //       <div>
  //         <h1 className="text-2xl font-bold">{car.name}</h1>
  //         <p className="text-gray-500">{car.fuelType} • {car.seats} Seats</p>
  //         <div className="mt-2 flex items-center text-yellow-500">
  //           <Star size={20} fill="currentColor" />
  //           <span className="ml-1 text-lg">{car.rating}</span>
  //         </div>
  //         <div className="mt-4 border p-4 rounded-lg shadow">
  //           <p className="text-gray-600">Trip Protection Fee: ₹{car.protectionFee}</p>
  //           <p className="text-xl font-semibold">Total Price: ₹{car.price}</p>
  //           {/* <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">Login to Continue</Button> */}
  //         </div>
  //       </div>
  //     </div>
  //     <div className="mt-8">
  //       <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
  //       {/* {car.reviews.map((review, index) => (
  //         <Card key={index} className="p-4 mt-3">
  //           <p className="font-medium">{review.name}</p>
  //           <p className="text-sm text-gray-500">{review.date}</p>
  //           <div className="flex items-center text-yellow-500">
  //             {[...Array(review.rating)].map((_, i) => (
  //               <Star key={i} size={16} fill="currentColor" />
  //             ))}
  //           </div>
  //           <p className="text-gray-700 mt-2">{review.text}</p>
  //         </Card>
  //       ))} */}
  //     </div>
  //   </div>
  // );
};

export default BookingModel;
