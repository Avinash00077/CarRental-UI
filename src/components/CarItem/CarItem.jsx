import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdDirectionsWalk } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useScreenSize } from "../../context/screenSizeContext";

const CarItem = ({ car, onBookNow }) => {
  const [openWarning, setOpenWarning] = useState(false);
  const userDetails = localStorage.getItem("userDetails");
    const isScreenSize = useScreenSize().isScreenSmall;
  const navigate = useNavigate();

  const onBookNowClick = (id) => {
    console.log("On click value is ");
    const {
      aadhar_verified,
      driving_license_expiry,
      driving_license_verified,
    } = JSON?.parse(userDetails);
    console.log(
      aadhar_verified !== "Y" &&
        driving_license_verified !== "Y" &&
        driving_license_expiry !== "N"
    );
    console.log(
      aadhar_verified !== "Y",
      driving_license_verified !== "Y",
      driving_license_expiry !== "N"
    );
    if (
      aadhar_verified !== "Y" &&
      driving_license_verified !== "Y" &&
      driving_license_expiry !== "N"
    ) {
      console.log("opne warnjnjjjjjjjjjjjjjjjjj  ");
      setOpenWarning(true);
    } else {
      onBookNow(id);
    }
  };

  return (
    <div>
      {openWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-5 bg-opacity-50">
          <div className = {`bg-white p-6 rounded-lg shadow-lg text-center ${isScreenSize ? "" : "w-1/3 h-2/5"}`}>
            <h2 className="text-xl font-semibold mb-2">
              Verify to Proceed Booking
            </h2>
            <p className="text-red-600 mb-4">
              Please verify your <span className="font-semibold">Aadhar</span>{" "}
              and <span className="font-semibold">Driving License</span> before
              booking.
            </p>
            <p className="text-red-500 font-medium mb-4">
              **Make sure your Driving License is not expired.
            </p>
            <span className="text-black font-medium">
              *NOTE : If you have received a verification email, please log in
              again.
            </span>
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => {navigate('/userProfile')}}
                className="bg-black text-white px-4 py-2 rounded-lg hover:scale-105 transition"
              >
                Go to Profile
              </button>
              <button
                onClick={() => setOpenWarning(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {
        <div
          className={`bg-white rounded-lg shadow-md p-3 hover:cursor-pointer ${isScreenSize ? "w-full p-4" : "w-80 "}`}
          onClick={() => onBookNowClick(car.car_id)}
        >
          <img
            src={car.car_cover_img_url}
            alt={car.name}
            className="w-full h-44 object-cover rounded-lg"
          />
          <div className="p-2">
            {/* Rating & Trips */}

            <div className="flex items-center space-x-2 text-sm text-white bg-black px-2 py-1 w-fit rounded-md">
              <FaStar className="text-yellow-400" />
              {car.average_car_rating > 0 && (
                <span>{car.average_car_rating}</span>
              )}
              {car.total_completed_rides > 0 && (
                <span> | {car.total_completed_rides} Trips</span>
              )}
              {car.total_completed_rides === 0 && (
                <span> | Be first one to Ride</span>
              )}
            </div>

            {/* Car Details */}
            <h2 className="text-lg font-semibold mt-2">
              {car.brand} {car.name}
            </h2>
            <p className="text-gray-600 text-sm">{car.model_year}</p>

            {/* Pricing */}
            <div className="flex items-center justify-between mt-1">
              <p className="text-xl font-bold">
                ₹{(car.daily_rent / 24).toFixed(0)}/hr
              </p>
              <p className="text-gray-500 text-sm">
                ₹{car.daily_rent} excluding fees
              </p>
            </div>

            {/* Features */}
            <p className="text-gray-500 text-sm mt-1">
              {"Good"} • {car.car_type} • {car.seater} Seats
            </p>

            {/* Location */}
            <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
              <MdDirectionsWalk />
              <span>3.8 km away</span>
            </div>

            {/* FASTag */}
            {car.fastag_availability === "Y" && (
              <div className="mt-2 bg-gray-200 text-xs font-bold px-2 py-1 w-fit rounded-md">
                ACTIVE FASTAG
              </div>
            )}
            {car.fastag_availability !== "Y" && (
              <div className="mt-2 bg-gray-200 text-xs font-bold px-2 py-1 w-fit rounded-md">
                FASTAG NOT AVILABLE
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default CarItem;
