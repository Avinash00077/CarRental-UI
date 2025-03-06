import React, { useState } from "react";
import { useScreenSize } from "../../context/screenSizeContext";
import { event } from "jquery";

const Filters = ({ cars, onFilter }) => {
  // Store selected filter values
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedSeaters, setSelectedSeaters] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [checked, setChecked] = useState({ good: false, new: false });
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 5000]);
  const [searchValue, setSerachValue] = useState("");
  const allowedValues = [4, 6, 8, 10, 12];
  const [selectedSeatCapacity, setSelectedSeatCapacity] = useState([4, 12]);

  const isScreenSize = useScreenSize().isScreenSmall;

  // 🔹 Always derive filter options from the FULL car list (not filteredCars)
  const getUniqueValues = (key) => [...new Set(cars.map((car) => car[key]))];

  const brands = getUniqueValues("brand");
  const carModels = getUniqueValues("name");
  const seaters = getUniqueValues("seater");
  const conditions = getUniqueValues("car_condition");

  // Handle filtering
  const handleFilter = () => {
    handlePriceRangeFilter("models", selectedBrands, selectedModels);
    // const filteredCars = cars.filter((car) => {
    //   return (
    //     (selectedBrands.length === 0 || selectedBrands.includes(car.brand)) &&
    //     (selectedModels.length === 0 || selectedModels.includes(car.name)) &&
    //     (selectedSeaters.length === 0 || selectedSeaters.includes(car.seater)) &&
    //     (selectedCondition.length === 0 || selectedCondition.includes(car.car_condition)) &&
    //     (parseFloat(car.daily_rent) >= selectedPriceRange[0] &&
    //       parseFloat(car.daily_rent) <= selectedPriceRange[1])
    //   );
    // });

    // onFilter(filteredCars);
  };

  // 🔹 Reset filters AND ensure full options remain
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedModels([]);
    setSelectedSeaters([]);
    setSelectedCondition([]);
    setSelectedPriceRange([0, 5000]);
    onFilter(cars); // Restore the full car list in the parent component
  };
  const handlePriceRangeFilter = (e, value, second) => {
    let updatedSearchValue
    if(value =="search"){
       updatedSearchValue = e.target.value.toLowerCase();
      setSerachValue(updatedSearchValue);
    }

    let newChecked = { ...checked };
    let newPriceRange = [...selectedPriceRange];
    let newSeatCapacity = [...selectedSeatCapacity];

    if (value === "price") {
        newPriceRange = [0, parseInt(e.target.value)];
        setSelectedPriceRange(newPriceRange);
    }

    if (value === "seats") {
        newSeatCapacity = [0, parseInt(e.target.value)];
        setSelectedSeatCapacity(newSeatCapacity);
    }

    if (value === "checkbox") {
        newChecked = { ...checked, [e.target.name]: e.target.checked };
        setChecked(newChecked);
    }

    // Apply filters
    let filteredCars = cars.filter((car) => car.daily_rent < newPriceRange[1]);
    filteredCars = filteredCars.filter((car) => car.seater < newSeatCapacity[1]);

    if (newChecked.good) {
        filteredCars = filteredCars.filter((car) => car.car_condition === "good");
    }
    if (newChecked.new) {
        filteredCars = filteredCars.filter((car) => car.car_condition === "new");
    }

    // Filtering by brand and model
    if (e === "models") {
        if (value.length > 0 || second.length > 0) {
            filteredCars = filteredCars.filter((car) =>
                (value.length === 0 || value.includes(car.brand)) &&
                (second.length === 0 || second.includes(car.name))
            );
        }
    }

    // 🔹 **Search Filtering (Checks all fields)**
    if (value === "search" && updatedSearchValue) {
        filteredCars = filteredCars.filter((car) => {
            return Object.values(car)
                .join(" ") // Combine all values into a single string
                .toLowerCase()
                .includes(updatedSearchValue); // Check if search value is in any field
        });
    }

    onFilter(filteredCars);
};


  return (
    <div className="h-full min-h-screen hidden lg:flex flex-col">
      <div className="m-1">
        <input
          type="text"
          placeholder="🔍 Search cars..."
          value={searchValue}
          onChange={(e) => handlePriceRangeFilter(e, "search", "tte")}
          className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none shadow-sm transition-all duration-200 ease-in-out"
        />
      </div>
      {/* Price Range */}
      <div className="m-2">
        <p className="text-start text-lg text-[16px] mx-2">Price Range</p>
        <input
          type="range"
          min="0"
          max="5000"
          value={selectedPriceRange[1]}
          onChange={(e) => handlePriceRangeFilter(e, "price", "he")}
          className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer 
             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
             [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black 
             [&::-webkit-slider-thumb]:rounded-full 
             [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 
             [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full"
        />
        <p className="text-center text-sm mt-1">
          ₹0 - ₹{selectedPriceRange[1]}
        </p>
      </div>
      <div className="m-2">
        <p className="text-start text-[16px] mx-2">seating Capacity</p>
        <input
          type="range"
          min="4"
          max="12"
          value={selectedSeatCapacity[1]}
          onChange={(e) => handlePriceRangeFilter(e, "seats", "sks")}
          className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer 
             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
             [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black 
             [&::-webkit-slider-thumb]:rounded-full 
             [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 
             [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full"
        />
        <p className="text-center text-sm mt-1">
          4 seats - {selectedSeatCapacity[1]} seats
        </p>
      </div>
      <div className="flex items-center gap-4 p-1">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="good"
            checked={checked.good}
            onChange={(e) => handlePriceRangeFilter(e, "checkbox", "ssk")}
            className="w-4 h-4 accent-black"
          />
          <p className="text-lg">Good</p>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="new"
            checked={checked.new}
            onChange={(e) => handlePriceRangeFilter(e, "checkbox", "hek")}
            className="w-4 h-4 accent-black"
          />
          <p className="text-lg">New</p>
        </label>
      </div>

      {/* Scrollable Filter Section */}
      <div className="no-scrollbar w-full flex h-full max-h-[600px] overflow-y-auto p-2 ">
        <FilterSection
          title="Brands"
          options={brands}
          selected={selectedBrands}
          setSelected={setSelectedBrands}
        />
        <FilterSection
          title="Car Models"
          options={carModels}
          selected={selectedModels}
          setSelected={setSelectedModels}
        />
        {/* <FilterSection title="Seating Capacity" options={seaters} selected={selectedSeaters} setSelected={setSelectedSeaters} /> */}
        {/* <FilterSection title="Car Condition" options={conditions} selected={selectedCondition} setSelected={setSelectedCondition} /> */}
      </div>

      {/* Apply & Reset Filters Button */}
      <div className="flex items-center justify-center mt-4 sticky bottom-0 bg-white p-2 shadow-md space-x-3">
        <button
          onClick={handleFilter}
          className="w-[140px] py-2 bg-[#121212] text-white rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="w-[140px] py-2 bg-gray-200 text-black rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// ✅ Reusable Checkbox Filter Section
const FilterSection = ({ title, options, selected, setSelected }) => {
  return (
    <div className="flex flex-col space-y-2 rounded-lg shadow-2xs pb-3">
      <p className="text-start text-lg font-semibold mx-2">{title}</p>
      <div className="no-scrollbar m-1 min-h-[300px] overflow-scroll bg-gray-50 rounded-lg  shadow-xl p-1">
        {options.map((option, index) => (
          <label key={index} className="flex items-center m-2">
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={() =>
                setSelected(
                  selected.includes(option)
                    ? selected.filter((v) => v !== option)
                    : [...selected, option]
                )
              }
              className="mr-3 scale-150 h-8 w-3 accent-black"
            />
            <p className="ml-2">{option}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
