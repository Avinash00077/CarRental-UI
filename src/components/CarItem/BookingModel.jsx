import React, { useState } from "react";
import axios from "axios";
import constants from "../../config/constants";

const BookingModel = ({ carInfo, closeModal }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const token = localStorage.getItem("authToken");

  // Function to calculate total days and amount
  const handleDateChange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayDiff = (end - start) / (1000 * 3600 * 24);
      setTotalDays(dayDiff);

      const rentPerDay = parseFloat(carInfo[0].daily_rent);
      setTotalAmount(rentPerDay * dayDiff);
    }
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
        `${constants.API_BASE_URL}/booking`,
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
      key: "rzp_test_tmfpOEiEDlAApc", // Replace with your Razorpay Key
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "Car Rental Service",
      description: "Booking Payment",
      image: "/logo.png",
      handler: async function (response) {
        console.log("Payment Successful:", response);

        // Update Booking Status
        const updateResponse = await updateBookingStatus(
          bookingId,
          response.razorpay_payment_id
        );
        console.log(updateResponse);
        if (response) {
          // Redirect User to Success Page
          window.location.href = "/myBookings";
        }
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
    console.log("Initiating booking...");

    const payload = {
      car_id: carInfo[0].car_id,
      start_date: startDate,
      end_date: endDate,
      payment_mode: "ONLINE",
      total_price: totalAmount,
    };

    try {
      const response = await axios.post(
        `${constants.API_BASE_URL}/booking`,
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
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:hover:text-gray-300 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>

        {/* Car Details */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">{carInfo[0].name}</h2>
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
            <label className="block text-sm font-semibold">
              Booking Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-sm mt-2"
              onBlur={handleDateChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Booking End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-2"
              onBlur={handleDateChange}
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
        <div className="mt-6">
          <button
            onClick={postBooking}
            className="w-full text-white p-2 text-lg bg-[#6f82c6] font-medium border-[#6f82c6] rounded-full hover:bg-gray-100 hover:text-black hover:border-[#6f82c6] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Next to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModel;
