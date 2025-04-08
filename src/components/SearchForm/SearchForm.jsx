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
  const authToken = localStorage.getItem("authToken");
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem("location") || "Hyderabad");
  const [openModal, setOpenModal] = useState(false);
  const [dropOffSlots,setDropOffSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [pickUpDate, setPickUpDate] = useState(
    parseDate(userSelectedDates?.fromDate) || ""
  );
  const [pickUpTime, setPickUpTime] = useState(
    userSelectedDates?.pickupTime ||""
  );

  const { isScreenSmall } = useScreenSize();
  const [dropOffDate, setDropOffDate] = useState(
    parseDate(userSelectedDates?.dropOffDate) || ""
  );
  const [dropOffTime, setDropOffTime] = useState(
    userSelectedDates?.dropOffTime || ""
  );
  const [rideDuration, setRideDuration] = useState("");


  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(/[: ]/);
    const period = time.includes("AM") ? "AM" : "PM";
    let hour = parseInt(hours);
  
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
  
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  useEffect(() => {
    if (userSelectedDates) {
      const duration = calculateDaysBetween(
        userSelectedDates.fromDate,
        userSelectedDates.dropOffDate
      );
      setRideDuration(duration);
    }
  }, [userSelectedDates]);
  const navigate = useNavigate();
  // ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM',
  const timeSlots = [ '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM']
  const timeSlotsIn24 = {
    "10:00 AM": "10:00",
    "11:00 AM": "11:00",
    "12:00 PM": "12:00",
    "1:00 PM": "13:00",
    "2:00 PM": "14:00",
    "3:00 PM": "15:00",
    "4:00 PM": "16:00",
    "5:00 PM": "17:00",
    "6:00 PM": "18:00",
    "7:00 PM": "19:00",
    "8:00 PM": "20:00",
    "9:00 PM": "21:00",
    "10:00 PM": "22:00",
  };
  
  const generateTimeSlots = (isToday) => {
    let slots = [];
  
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    let currentHour = istTime.getHours();
  
    const minHour = 10; // 10 AM
    const maxHour = 22; // 10 PM
  
    let startHour = isToday ? Math.max(currentHour + 1, minHour) : minHour;
  
    for (let hour = startHour; hour <= maxHour; hour++) {
      let displayHour = hour % 12 || 12;
      let ampm = hour >= 12 ? "PM" : "AM";
      slots.push(`${displayHour}:00 ${ampm}`);
    }
  
    return slots;
  };
  
  
  const formatToYYYYMMDD = (date) => {
    if (!date) return "";
  
    // Convert to IST manually to prevent timezone issues
    const istOffset = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    
    return istDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };
  
    useEffect(() => {
      const today = formatToYYYYMMDD(new Date()); // Get today in correct format
      const formattedPickUpDate = pickUpDate ? formatToYYYYMMDD(new Date(pickUpDate)) : "";
      const isToday = formattedPickUpDate === today;
      console.log(isToday,"KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKk")
      setAvailableSlots(generateTimeSlots(isToday));
    }, [pickUpDate]);

    const getAvailableDropOffTimes = () => {
      // Ensure pickUpDate and dropOffDate are Date objects
      const pickUp = new Date(pickUpDate);
      const dropOff = new Date(dropOffDate);
  
      console.log(pickUp, dropOff, "Hello Sudheer, I am here. How are you?");
  
      // Compare only the date (ignoring time)
      const isSameDate =
          pickUp.getFullYear() === dropOff.getFullYear() &&
          pickUp.getMonth() === dropOff.getMonth() &&
          pickUp.getDate() === dropOff.getDate();
  
      console.log("Are dates the same?", isSameDate);
  
      if (!isSameDate) {
          return timeSlots; // Return all time slots if different days
      }
  
      const pickUpIndex = timeSlots.indexOf(pickUpTime);
  
      // Ensure pickUpTime exists in timeSlots before slicing
      return pickUpIndex !== -1 ? timeSlots.slice(pickUpIndex + 1) : [];
  };
  
  

    useEffect(() => {
      const availableTimes = getAvailableDropOffTimes();
      setDropOffSlots(availableTimes)
      if (!availableTimes.includes(dropOffTime)) {
        // setDropOffTime(availableTimes[0]); // Set first available drop-off time
      }
    }, [pickUpTime, pickUpDate, dropOffDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(pickUpTime,dropOffTime)
    //const pickupTime = convertTo24HourFormat(pickUpTime)
    const pickupTime = timeSlotsIn24[pickUpTime]
    // const dropffTime = convertTo24HourFormat(dropOffTime)
    const dropffTime = timeSlotsIn24[dropOffTime]
    if (pickUpDate !== "" && pickUpTime !== "" && authToken) {

      console.log(pickupTime,dropffTime,"HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhh")
      navigate(
        `/viewCars?pickUpDate=${pickUpDate}&toDate=${dropOffDate}&location=${selectedLocation}&pickupTime=${pickupTime}&dropoffTime=${dropffTime}`
      );
    }else{
      localStorage.setItem("initialSelectedDate", JSON.stringify({ pickUpDate, dropOffDate,pickupTime,dropffTime,selectedLocation }));
      window.location.href = "/auth";
    }
  };

  useEffect(()=>{
    const loaction = localStorage?.getItem("location");
    if(!loaction){
      setOpenModal(true)
    }
  },[selectedLocation])
  const handleLocation = (location)=>{
    setSelectedLocation(location)
    localStorage.setItem("location",location)
  }

  return (
    <form
      className="flex  flex-col items-center  justify-center"
      onSubmit={handleSubmit}
    >
      {openModal && fromWhere === "homePage" && (
        <LocationModal
          closeModal={() => setOpenModal(false)}
          onSelectLocation={(location) =>handleLocation(location) }
        />
      )}
      <div
        className={`md:flex md:flex-col items-center  justify-center p-2 rounded-3xl shadow-2xl ${
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
                className="text-2xl font-bold text-[#121212] mb-4 mt-5 ml-4"
                //style={{ margin: "20px" }}
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
                  className="cursor-pointer font-extralight text-[17px] text-[#121212]"
                  style={{ marginLeft: "5px" }}
                  onClick={() => setOpenModal(!openModal)}
                >
                  {selectedLocation}
                </span>{" "}
              </div>
            </div>
          ) : (
            <div className="text-start ">
              <p>Select Date & Time</p>
              <p className="flex">
                Ride Duration - {rideDuration}{" "}
                <div style={{ margin: "0px 5px" }}>Days</div>
              </p>
            </div>
          )}
        </div>

        <p
          className="text-[17px] text-start w-full text-[#121212] "
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
              className={`  ${
                fromWhere === "homePage" ? "w-full h-10" : "h-14 w-full te"
              }`}
              
              id="buttondisplay"
              value={pickUpDate}
              placeholder="Pickup Date"
              onChange={(e) => {setPickUpDate(e.value)}}
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
                  options={availableSlots}
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
          className="text-[17px] text-start w-full text-[#121212] "
          style={{
            marginLeft: fromWhere === "homePage" ? "10px" : "0px",
            marginBottom: fromWhere === "homePage" ? "5px" : "0px",
          }}
        >
          Drop Off
        </p>
        <div className={`flex  items-center justify-center w-full ${fromWhere =="homePage"?'mb-5':'mb-1'}`}>
          <div className="w-1/2">
            <Calendar
              className={`${
                fromWhere === "homePage" ? "w-full h-10" : "h-14 w-full"
              }`}
              id="buttondisplay"
              value={dropOffDate}
              placeholder="DropOff Date"
              onChange={(e) => setDropOffDate(e.value)}
              minDate={new Date(pickUpDate)}
              showIcon
            />
          </div>
          <div className="w-1/2">
            {fromWhere === "homePage" ? (
              <div className="relative w-11/12" style={{ margin: "0px 10px" }}>
                <Dropdown
                  value={dropOffTime}
                  onChange={(e) => setDropOffTime(e.value)}
                  options={dropOffSlots}
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
            className={`w-[80%] h-[43px] bg-[#121212] text-white text-[18px] font-medium rounded-full focus:outline-none 
              ${!pickUpDate || !dropOffDate || !pickUpTime || !dropOffTime ? "bg-[#545454] cursor-not-allowed" : 'cursor-pointer '}`}
              disabled={!pickUpDate || !dropOffDate || !pickUpTime || !dropOffTime}
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
};
export default SearchForm;
