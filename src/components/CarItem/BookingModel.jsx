import React, { useState } from "react";
import axios from "axios";
import constants from "../../config/constants";

const BookingModel = ({ carInfo, closeModal }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  // Function to calculate the total days and total amount
  const handleDateChange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      setTotalDays(dayDiff);

      const rentPerDay = parseFloat(carInfo[0].daily_rent);
      setTotalAmount(rentPerDay * dayDiff);
    }
  };

  const startRazorpayPayment = (bookingId, amount) => {
    const options = {
      key: "GD40PiJmoQqYygc6DGyaQ82T", // Replace with your Razorpay API Key
      amount: amount* 100, // Razorpay expects amount in paise (INR 100 = 10000 paise)
      currency: "INR",
      name: "Car Rental Service",
      description: "Booking Payment",
      image: "/logo.png", // Replace with your logo
      handler: async function (response) {
        console.log("Payment Successful:", response);
        
        // 3️⃣ Update Booking to "Confirmed"
        await updateBookingStatus(bookingId, response.razorpay_payment_id);
        
        // 4️⃣ Redirect User to Success Page
        window.location.href = "/payment-success"; // Change to your success page
      },
      prefill: {
        name: "Avinash", // Fetch from user state if available
        email: "avinashreddytummuri77@gmail.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  let payload = {
    car_id: carInfo[0].car_id,
    start_date: startDate,
    end_date: endDate,
    payment_mode: "ONLINE",
    total_price: totalAmount,
  };

  const postBooking = async () => {
    console.log("Helo sisisi");
    const token = localStorage.getItem("authToken");
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
      startRazorpayPayment(2, totalAmount);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div
        className="bg-white  dark:bg-neutral-900  text-black dark:text-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-6 relative"
        style={{ padding: "20px" }}
      >
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
        <div className="space-y-4  dark:bg-neutral-800 p-4 rounded-lg">
          <div>
            <label
              className="block text-sm font-semibold"
              style={{ margin: "10px" }}
            >
              Booking Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-sm mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
              onBlur={handleDateChange}
              style={{ margin: "0px 10px", padding: "5px" }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold"
              style={{ margin: "10px" }}
            >
              Booking End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
              onBlur={handleDateChange}
              style={{
                margin: "0px 10px",
                padding: "5px",
                marginBottom: "15px",
              }}
            />
          </div>
        </div>

        {/* Total Days and Total Amount */}
        {totalDays > 0 && (
          <div className="mt-4 text-center  dark:bg-neutral-800 p-4 rounded-lg ">
            <p className="font-semibold text-lg" style={{ margin: "10px 0px" }}>
              Total Days: {totalDays}
            </p>
            <p className="font-semibold text-lg text-[#6f82c6] dark:text-blue-400">
              Total Rent: ₹{totalAmount.toFixed(2)}
            </p>
          </div>
        )}

        {/* Next to Pay Button */}
        <div className="mt-6">
          <button
            onClick={() => postBooking}
            style={{ margin: "10px", padding: "7px 5px", marginLeft: "10%" }}
            className="mx-2 text-white flex justify-center items-center p-2 text-[15px] h-10 w-[80%] border-[3px] bg-[#6f82c6] font-medium border-[#6f82c6] rounded-full hover:bg-gray-100 hover:text-black hover:border-[#6f82c6] transition-colors duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Next to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModel;
