import React, { useState } from "react";
import Date from "../../assets/date.png";
import Clock from "../../assets/clock.png";
import location from "../../assets/gps.png";
import LocationModal from "./LocationModal";
import { useNavigate } from "react-router-dom";

import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

const SearchForm = ({ fromWhere }) => {
  const [selectedLocation, setSelectedLocation] = useState("Hyderabad");
  const [openModal, setOpenModal] = useState(false);
  const [pickUpDate, setPickUpDate] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [dropOffTime, setDropOffTime] = useState("");
  const navigate = useNavigate();
  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM ",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];
  console.log(fromWhere, " Inside the filters how wecan handle");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Pick Up Date: ",
      pickUpDate,
      "Pick Up Time: ",
      pickUpTime,
      "Drop Off Date: ",
      dropOffDate,
      "Drop Off Time: ",
      dropOffTime
    );

    if (pickUpDate !== "" && pickUpTime !== "") {
      navigate(
        `/viewCars?pickUpDate=${pickUpDate}&toDate=${dropOffDate}&location=${selectedLocation}`
      );
    }
  };

  return (
    <form
      className="flex  flex-col items-center justify-center"
      onSubmit={handleSubmit}
    >
      {openModal && fromWhere === "homePage" && (
        <LocationModal
          closeModal={() => setOpenModal(false)}
          onSelectLocation={(location) => setSelectedLocation(location)}
        />
      )}
      <div
      className={`md:flex md:flex-col items-center justify-center p-2 rounded-3xl shadow-2xl ${fromWhere === "homePage" ? "w-[85%]" : "w-[93%]"}`}

        style={{ margin: "0px 0px ", padding: "10px" }}
      >
        <div className="w-full">
          {fromWhere === "homePage" ? (
            <div>
              <p
                className="text-2xl font-bold text-gray-800 mb-4"
                style={{ margin: "20px" }}
              >
                Book Your Ride !
              </p>
              <div className="flex items-center justify-end w-full cursor-pointer">
                <img
                  src={location}
                  className="w-7 h-7"
                  onClick={() => setOpenModal(!openModal)}
                ></img>{" "}
                <span
                  className="cursor-pointer font-extralight text-[17px]"
                  style={{ marginLeft: "5px" }}
                  onClick={() => setOpenModal(!openModal)}
                >
                  {selectedLocation}
                </span>{" "}
              </div>
            </div>
          ) : (
            <div className="text-start">
              <p >Select Date & Time</p>
              <p>Ride Duration - (1 day)</p>
            </div>
          )}
        </div>

        <p
          className="text-[17px] text-start w-full "
          style={{
            marginLeft: fromWhere === "homePage" ? "10px" : "0",
            marginBottom: fromWhere === "homePage" ? "5px" : "0",
          }}
        >
          Pick Up
        </p>
        <div className="flex  items-center justify-center w-full mb-5">
          <div className="w-1/2">
            <Calendar
              className={`${
                fromWhere === "homePage" ? "w-full h-10" : "h-14 w-full"
              }`}
              id="buttondisplay"
              value={pickUpDate}
              placeholder="Pickup Date"
              onChange={(e) => setPickUpDate(e.value)}
              showIcon
            />
          </div>
          <div className="w-1/2">
            {fromWhere === "homePage" ? (
              <div className="relative w-11/12" style={{ margin: "0px 10px" }}>
                <Dropdown
                  value={pickUpTime}
                  onChange={(e) => setPickUpTime(e.value)}
                  options={timeSlots}
                  optionLabel="name"
                  placeholder="pickup Time"
                  className="w-full h-10 text-xs flex justify-center items-center"
                  style={{ paddingLeft: "10px" }}
                />
                {fromWhere === "homePage" && (
                  <img
                    src={Clock}
                    alt="Date"
                    className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    style={{ width: "20px", height: "20px" }}
                    onClick={() =>
                      document.querySelector("input[type='text']").click()
                    }
                  />
                )}
              </div>
            ) : (
              <select
                value={pickUpTime}
                onChange={(e) => setPickUpTime(e.target.value)}
                className="w-36 h-10 border rounded px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Pickup Time
                </option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <p
          className="text-[17px] text-start w-full "
          style={{
            marginLeft: fromWhere === "homePage" ? "10px" : "0",
            marginBottom: fromWhere === "homePage" ? "5px" : "0",
          }}
        >
          Drop Off
        </p>
        <div className="flex  items-center justify-center w-full mb-5">
          <div className="w-1/2">
            <Calendar
              className={`${
                fromWhere === "homePage" ? "w-full h-10" : "h-14 w-full"
              }`}
              id="buttondisplay"
              value={dropOffDate}
              placeholder="DropOff Date"
              onChange={(e) => setDropOffDate(e.value)}
              showIcon
            />
          </div>
          <div className="w-1/2">
            {fromWhere === "homePage" ? (
              <div className="relative w-11/12" style={{ margin: "0px 10px" }}>
                <Dropdown
                  value={dropOffTime}
                  onChange={(e) => setDropOffTime(e.value)}
                  options={timeSlots}
                  optionLabel="name"
                  placeholder="Dropoff Time"
                  className="w-full h-10 text-xs flex justify-center items-center"
                  style={{ paddingLeft: "10px" }}
                />
                {fromWhere === "homePage" && (
                  
                  <img
                    src={Clock}
                    alt="Date"
                    className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    style={{ width: "20px", height: "20px" }}
                    onClick={() =>
                      document.querySelector("input[type='text']").click()
                    }
                  />
                )}
              </div>
            ) : (
              <select
                value={dropOffTime}
                onChange={(e) => setDropOffTime(e.target.value)}
                className="w-36 h-10 border rounded px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Pickup Time
                </option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {fromWhere == "homePage" && (
          <button
            type="submit"
            style={{ margin: "20px 20px" }}
            className="w-[80%] h-[43px] bg-gradient-to-r from-[#6578ca] to-[#9cb0f1] text-white text-[18px] font-medium rounded-full focus:outline-none"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
};
export default SearchForm;
