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
    <div
      className="max-w-sm rounded-2xl md:grid-cols-3 p-3 items-center  justify-center h-[350px] bg-gradient-to-t from-white  to-[#cee2f8]  overflow-hidden shadow-xl border border-gray-200 hover:shadow-lg hover:scale-101 "
      style={{ padding: "10px", margin: "10px" }}
    >
      <div className="relative">
        <p className=" text-right font-semibold text-[#6f82c6]">
          {carsLeft}+ Cars Left
        </p>
        <p className="text-lg font-semibold text-center text-gray-800">
          {" "}
          {brand} {name}
        </p>
        <div className="flex items-center justify-center">
          <img
            src={image}
            alt="Car"
            className="w-[70%] h-48 object-fit rounded-xl "
          />
        </div>
      </div>
      <div
        className="flex justify-start items-start"
        style={{ marginTop: "10px" }}
      >
        <div className="" style={{ paddingRight: "60px" }}>
          <div className="p-6">
            <div className="flex flex-col items-start justify-start text-sm ">
              <p className="text-gray-500">
                <span className="font-semibold text-gray-800 text-xl">₹</span>{" "}
                RS {daily_rent}
              </p>
              <p className="text-gray-500">(179 KM included)</p>
              <p className="text-gray-500">Excess ₹ 3.5/km</p>
            </div>
            <div></div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-center items-center">
          <img
            src={assets.rating_starts}
            alt="Rating"
            className="w-20 h-4"
            style={{ marginBottom: "10px" }}
          />
          <button
            className="w-[140px] py-2 h-[40px] text-sm bg-[#6f82c6] font-medium border border-[#6f82c6] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out 
  hover:bg-[#5a6bab] hover:border-[#5a6bab] hover:shadow-lg hover:scale-105 
  active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6f82c6]"
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
