import React, { useState, useEffect } from "react";
import axios from "axios";
import constants from "../../config/constants";
import Loader from "../../components/Loader/Loader";
import { Calendar } from "primereact/calendar";
import "primereact/resources/primereact.min.css";
import { calculateDaysBetween, parseDate,formatDateToYYYYMMDD } from "../../utils/dateUtils";
import { useScreenSize } from "../../context/screenSizeContext";
import "primereact/resources/themes/lara-light-blue/theme.css";

const BookingModel = ({ carInfo, closeModal, userSelectedDates }) => {
  const [startDate, setStartDate] = useState(
    parseDate(userSelectedDates?.fromDate) || ""
  );
  const [endDate, setEndDate] = useState(
    parseDate(userSelectedDates?.dropOffDate) || ""
  );
  const isScreenSize = useScreenSize().isScreenSmall;
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const token = localStorage.getItem("authToken");
  const [isLoaderOpen, setLoaderOpen] = useState(false);

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
  useEffect(() => {
    if (userSelectedDates) {
      const duration = calculateDaysBetween(startDate, endDate);
      console.log(duration, " Caliculated duration is ");
      setTotalDays(duration);
      const rentPerDay = parseFloat(carInfo[0].daily_rent);
      setTotalAmount(rentPerDay * duration);
    }
  }, [startDate, endDate]);

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
        window.location.href = "/myBookings";
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
      start_time:userSelectedDates.start_time || "10:00",
      end_time:userSelectedDates.end_time||"11:00",
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`bg-white dark:bg-neutral-900 text-black dark:text-white rounded-lg shadow-xl ${
          isScreenSize ? "w-[370px]" : "w-full"
        } max-w-lg p-6 space-y-6 relative`}
        style={{ padding: "20px" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:hover:text-gray-300 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
        {isLoaderOpen && <Loader />}

        {/* Car Details */}
        <div className="text-center">
          <h2 className="text-2xl font-bold" style={{ padding: "10px" }}>
            {carInfo[0].name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {carInfo[0].brand} - {carInfo[0].model_year}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {carInfo[0].description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {carInfo[0].location}
          </p>
        </div>

        {/* Booking Form */}
        <div className="space-y-4 dark:bg-neutral-800 p-4 rounded-lg">
          <div>
            <label className="block text-medium " style={{ padding: "10px" }}>
              Booking Start Date
            </label>
            <Calendar
              className={`${"w-full h-10"}`}
              id="buttondisplay"
              value={startDate}
              placeholder="PickUp Date"
              onChange={(e) => setStartDate(e.value)}
              minDate={new Date()}
              showIcon
            />
          </div>

          <div>
            <label className="block " style={{ padding: "10px" }}>
              Booking End Date
            </label>
            <Calendar
              className={`${"w-full h-10"}`}
              id="buttondisplay"
              value={endDate}
              placeholder="DropOff Date"
              onChange={(e) => setEndDate(e.value)}
              minDate={new Date()}
              showIcon
            />
          </div>
        </div>

        {/* Total Days and Total Amount */}
        {totalDays > 0 && (
          <div className="mt-4 text-center dark:bg-neutral-800 p-4 rounded-lg">
            <p className="font-semibold text-lg">Total Days: {totalDays}</p>
            <p className="font-semibold text-lg text-[#6f82c6] dark:text-blue-400">
              Total Rent: ₹{totalAmount.toFixed(2)}
            </p>
          </div>
        )}

        {/* Next to Pay Button */}
        <div className="mt-6" style={{ padding: "10px", paddingTop: "20px" }}>
          <button
            onClick={postBooking}
            style={{ padding: "7px" }}
            className="w-full text-white p-2 text-lg bg-[#6f82c6] font-medium border-[#6f82c6] rounded-lg hover:bg-gray-100 hover:text-black hover:border-[#6f82c6] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Next to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModel;
