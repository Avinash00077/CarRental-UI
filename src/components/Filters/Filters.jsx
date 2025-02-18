import React, { useState } from "react";
import SearchForm from "../SearchForm/SearchForm";

const Filters = ({userSelectedDates}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
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
    <div className="h-full">
      <div
        className="flex justify-between items-center  w-full "
        style={{ padding: "10px", paddingTop: "15px" }}
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
      <SearchForm fromWhere="insideCars" userSelectedDates ={userSelectedDates} />
      <div
        className="w-full h-[1px] bg-gray-300"
        style={{ margin: "10px 0px" }}
      >
        {" "}
      </div>
      <div className="flex flex-col space-y-2">
        <p
          className="text-start text-lg font-semibold"
          style={{ margin: "10px", marginTop: "5px" }}
        >
          Vehicle Models{" "}
        </p>
        <div
          className="no-scrollbar m-2  h-[200px] overflow-y-auto bg-white rounded-2xl shadow-xl p-2"
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

        <div
          className="flex items-center justify-center"
          style={{ marginTop: "10px" }}
        >
          <button
            className="w-[180px] py-2 h-[40px] text-sm bg-[#6f82c6] font-medium border border-[#6f82c6] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out 
  hover:bg-[#5a6bab] hover:border-[#5a6bab] hover:shadow-lg hover:scale-105 
  active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6f82c6]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
