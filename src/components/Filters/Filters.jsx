import React, { useState } from "react";
import SearchForm from "../SearchForm/SearchForm";
import { useScreenSize } from "../../context/screenSizeContext";

const Filters = ({ userSelectedDates }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const isScreenSize = useScreenSize().isScreenSmall;
  const carModels = [
    "Maruti Suzuki Swift",
    "Hyundai i20",
    "Tata Nexon",
    "Mahindra XUV700",
    "Honda City",
    "Maruti Suzuki Baleno",
    "Toyota Innova Crysta",
  ];
  // Handle checkbox changes
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        // Unselect option
        return prev.filter((item) => item !== value);
      } else {
        // Select option
        return [...prev, value];
      }
    });
  };

  return (
    <div>
      <div className="h-full hidden lg:flex flex-col">
        <div
          className="flex justify-between items-center  w-full py-1 pt-0"
        >
          <div className="">
            <p className="text-xl font-semibold">Filter </p>
          </div>
          <div>
            <select className="w-44 h-8 border rounded px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>
                Sort By
              </option>
              <option value="option1">Newly Added</option>
              <option value="option2">Price High To Low</option>
              <option value="option3">Price Low To High</option>
            </select>
          </div>
        </div>
        <div
          className="w-full h-[1px] bg-gray-300"
          style={{ margin: "5px 0px" }}
        ></div>
        <SearchForm
          fromWhere="insideCars"
          userSelectedDates={userSelectedDates}
        />
        <div
          className="w-full h-[1px] bg-gray-300"
          style={{ margin: "10px 0px" }}
        >
          {" "}
        </div>
        <div className="flex flex-col space-y-2  mx-1  rounded-lg shadow-2xs pb-3">
          <p
            className="text-start text-lg font-semibold"
            style={{ margin: "10px", marginTop: "5px" }}
          >
            Vehicle Models{" "}
          </p>
          <div
            className="no-scrollbar m-2  h-[210px] overflow-y-auto bg-gray-50 rounded-2xl shadow-xl p-2 pb-0"
            style={{ padding: "15px 20px", margin: "0px 10px" }}
          >
            {[
              "Maruti Suzuki Swift",
              "Hyundai i20",
              "Tata Nexon",
              "Mahindra XUV700",
              "Honda City",
              "Maruti Suzuki Baleno",
              "Toyota Innova Crysta",
            ].map((option, index) => (
              <label
                key={index}
                className="flex items-center m-2"
                style={{ marginTop: "0px" }}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleChange}
                  className="mr-3 scale-150 h-8 w-3"
                />
                <p className="" style={{ marginLeft: "10px" }}>
                  {" "}
                  {option}
                </p>
              </label>
            ))}
          </div>
        </div>
        <div
            className="flex items-center justify-center"
            style={{ marginTop: "10px" }}
          >
            <button
              className="w-[180px] py-2 h-[40px] cursor-pointer text-sm bg-[#121212] font-medium border border-[#121212] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out 
  hover:bg-[#121212] hover:border-[#121212] hover:shadow-lg hover:scale-105 
  active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#121212]"
            >
              Apply Filters
            </button>
          </div>
      </div>

      {isScreenSize && (
        <div
          className="w-full flex items-center justify-between"
          style={{ padding: "3px 10px" }}
        >
          <div>
            <select className="w-44 h-10 border rounded px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>
                Sort By Type
              </option>
              <option value="option1">Newly Added</option>
              <option value="option2">Price High To Low</option>
              <option value="option3">Price Low To High</option>
            </select>
          </div>
          <div>
            <select className="w-44 h-10 border rounded px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>
                Sort By Model
              </option>
              {carModels.map((car, index) => (
                <option key={index} value={car}>
                  {car}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
