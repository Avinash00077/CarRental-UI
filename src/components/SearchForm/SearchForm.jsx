import React, { useState, useEffect } from "react";
import Clock from "../../assets/clock.png";
import location from "../../assets/gps.png";
import LocationModal from "./LocationModal";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "../../context/screenSizeContext";
import { calculateDaysBetween, parseDate } from "../../utils/dateUtils";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

const SearchForm = ({ fromWhere, userSelectedDates }) => {
  const parseDate = (dateString) => {
    if (userSelectedDates) {
      const [year, month, day] = dateString?.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
  };
  const [selectedLocation, setSelectedLocation] = useState("Hyderabad");
  const [openModal, setOpenModal] = useState(false);
  const [pickUpDate, setPickUpDate] = useState(
    parseDate(userSelectedDates?.fromDate) || ""
  );
  const [pickUpTime, setPickUpTime] = useState(
    userSelectedDates?.pickupTime || "10:00 AM"
  );
  const { isScreenSmall } = useScreenSize();
  const [dropOffDate, setDropOffDate] = useState(
    parseDate(userSelectedDates?.dropOffDate) || ""
  );
  const [dropOffTime, setDropOffTime] = useState(
    userSelectedDates?.dropOffTime || "11:00 AM"
  );
  const [rideDuration, setRideDuration] = useState("");

  useEffect(() => {
    if (userSelectedDates) {
      const duration = calculateDaysBetween(
        userSelectedDates.fromDate,
        userSelectedDates.dropOffDate
      );
      console.log(duration, " Caliculated duration is ");
      setRideDuration(duration);
    }
  }, [userSelectedDates]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickUpDate !== "" && pickUpTime !== "") {
      navigate(
        `/viewCars?pickUpDate=${pickUpDate}&toDate=${dropOffDate}&location=${selectedLocation}&pickupTime=${pickUpTime}&dropoffTime=${dropOffTime}`
      );
    }
  };

  return (
    <form
      className="flex  flex-col items-center  justify-center"
      onSubmit={handleSubmit}
    >
      {openModal && fromWhere === "homePage" && (
        <LocationModal
          closeModal={() => setOpenModal(false)}
          onSelectLocation={(location) => setSelectedLocation(location)}
        />
      )}
      <div
        className={`md:flex md:flex-col items-center bg-gradient-to-b from-[#caefd7] via-[#f5bfd7] to-[#abc9e9] justify-center p-2 rounded-3xl shadow-2xl ${
          isScreenSmall
            ? "w-full"
            : fromWhere === "homePage"
            ? "w-[85%]"
            : "w-[93%]"
        }`}
        style={{
          margin: "0px 0px ",
          padding: "10px",
          ...(isScreenSmall && { marginTop: "20px" }),
        }}
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
              <p>Select Date & Time</p>
              <p className="flex">
                Ride Duration - {rideDuration}{" "}
                <div style={{ margin: "0px 5px" }}>Days</div>
              </p>
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
              minDate={new Date()}
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
              minDate={new Date()}
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
            className="w-[80%] h-[43px] bg-gradient-to-r from-[#6578ca] to-[#9cb0f1] text-white text-[18px] font-medium rounded-full focus:outline-none cursor-pointer"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
};
export default SearchForm;
