import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

const CarItem = ({
  id,
  name,
  price,
  description,
  image,
  brand,
  userSelectedDates,
  availability,
  daily_rent,
  model_year,
  registration_number,
  image_ext,
  location,
  onBookNow,
}) => {
  const [carsLeft, setCarsLeft] = useState(5);
  useEffect(() => {
    setCarsLeft(Math.floor(Math.random() * 6) + 1);
  }, []);

  const onBookNowClick = (id) => {
    console.log(id, model_year, registration_number, daily_rent);
    onBookNow(id);
  };

  return (
    <div className="max-w-sm rounded-2xl p-6 pb-3 mx-2 my-2.5 h-[350px] overflow-hidden shadow-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-transform duration-300 mr-10">
      <div className="relative">
        {/* Cars Left
        <p className="text-right font-semibold text-[#121212]">
          {carsLeft}+ Cars Left
        </p> */}

        {/* Car Brand and Name */}
        <p className="text-lg font-semibold text-center text-gray-800 mt-2">
          {brand} {name}
        </p>

        {/* Car Image */}
        <div className="flex items-center justify-center mt-4">
          <img
            src={image}
            alt="Car"
            className="w-full h-36 object-cover rounded-xl cursor-pointer"
            onClick={() => onBookNowClick(id)}
          />
        </div>
      </div>

      {/* Pricing and Rating Section */}
      <div className="mt-6 flex justify-between items-start">
        {/* Pricing Details */}
        <div className="flex flex-col items-start">
          <p className="text-gray-500">
            <span className="font-semibold text-gray-800 text-xl">₹</span> RS{" "}
            {daily_rent}
          </p>
          <p className="text-gray-500 text-xs mt-1">(179 KM included)</p>
          <p className="text-gray-500 text-xs mt-1">Excess ₹ 3.5/km</p>
        </div>

        {/* Rating and Book Now Button */}
        <div className="flex flex-col items-center">
          <img
            src={assets.rating_starts}
            alt="Rating"
            className="w-20 h-4 mb-2"
          />
          <button
            className="w-[140px] py-2 text-sm bg-[#121212] cursor-pointer font-medium text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#121212] hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6f82c6]"
            onClick={() => onBookNowClick(id)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarItem;
