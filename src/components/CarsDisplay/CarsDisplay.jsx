import React, { useContext,useRef } from "react";
import "./CarsDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import CarItem from "../CarItem/CarItem";
import axios from "axios";
import constants from "../../config/constants";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Filters from "../Filters/Filters";
import Loader from "../Loader/Loader";
import { useScreenSize } from "../../context/screenSizeContext";
import Modal from "../Modal/Modal";
import BookingModel from "../CarItem/BookingModel";
import sad from "../../assets/sad.gif";
import { TbRuler } from "react-icons/tb";

const CarsDisplay = ({ category }) => {
  const [carList, setCarList] = useState([]);
  const [searchParams] = useSearchParams();
  const pickUpDateString = searchParams.get("pickUpDate");
  const dropOffDate = searchParams.get("toDate");
  const userLocation = searchParams.get("location");
  const pickupTime = searchParams.get("pickupTime").split(" ")[0];
  const dropOffTime = searchParams.get("dropoffTime").split(" ")[0];
  const [isLoaderOpen, setIsLoderOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isScreenSize = useScreenSize().isScreenSmall;
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedCar, setSelectedCar] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const reloadRef = useRef(false);
  const [filteredCars, setFilteredCars] = useState([]);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("reloaded") !== "true") {
      sessionStorage.setItem("reloaded", "true");
      location.reload();
    } else {
      setTimeout(() => {
        sessionStorage.removeItem("reloaded");
        localStorage.removeItem("initialSelectedDate")
      }, 5000);
    }
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleFilter = (filteredCars) => {
    console.log(filteredCars, " jdddddddd");
    setFilteredCars(filteredCars);
  };
  const pickUpDate = pickUpDateString ? new Date(pickUpDateString) : null;
  const formattedDropOffDate = dropOffDate ? formatDate(dropOffDate) : null;
  const formattedPickUpDate =
    pickUpDate &&
    `${pickUpDate.getFullYear()}/${String(pickUpDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(pickUpDate.getDate()).padStart(2, "0")}`;
  const userSelectedDates = {
    fromDate: formattedPickUpDate,
    dropOffDate: formattedDropOffDate,
    pickupTime: pickupTime,
    dropOffTime: dropOffTime,
  };
  useEffect(() => {
    setIsLoderOpen(true);
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${constants.API_BASE_URL}/user/car`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            location: userLocation || "",
            start_date: formattedPickUpDate,
            end_date: formattedDropOffDate,
            end_time: dropOffTime || "11:00",
            start_time: pickupTime || "10:00",
          },
        });
        //start_date: formattedPickUpDate|| "2025/02/21",
        // end_date: formattedDropOffDate ||"2025/02/23",
        console.log(
          response.data.data,
          " Helelo data ta sjsjsjs heelo sudheer how are you"
        );
        setCarList(response.data.data);
        setFilteredCars(response.data.data);
        setIsLoderOpen(false);
      } catch (error) {
        console.error("Error fetching car list:", error);
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
        setIsLoderOpen(false);
      }
    };
    fetchData();
  }, []);
  const handleBookNow = (id) => {
    const currentItems = carList.filter((x) => x.car_id == id);
    navigate(
      `/BookRide?startDate=${formattedPickUpDate}&carId=${
        currentItems[0].car_id
      }&endDate=${formattedDropOffDate}&startTime=${
        pickupTime || "10:00"
      }&endTime=${dropOffTime || "11:00"}`
    );
    setIsBookingOpen(!isBookingOpen);
    setIsFilterOpen(false);
    setSelectedCar(currentItems[0]);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="w-full">
        {isBookingOpen && (
          <BookingModel
            car={selectedCar}
            userSelectedDates={userSelectedDates}
            closeModal={() => setIsBookingOpen(false)}
          />
        )}
                {isLoaderOpen && <Loader message="Please wait we are fetching cars for you" />}
        {isModalOpen && (
          <div>
            <Modal
              typeOfModal="failure"
              message="Something went wrong"
              closeModal={closeModal}
            />
          </div>
        )}
      </div>
      <div
        className={` flex ${isLogin ? "w-full" : "w-full"} ${
          isScreenSize && "h-14"
        }`}
        style={{
          marginTop: "65px",
        }}
      >
        <div
          className={`heading lg:w-[22%] ${
            isScreenSize
              ? " w-full "
              : "shadow-2xl flex h-screen fixed top-0 left-0"
          }`}
          style={{
            marginLeft: isLogin && !isScreenSize ? "4.5%" : undefined,
            marginTop: isScreenSize ? "0px" : "80px",
          }}
        >
          {/* {isScreenSize && isFilterOpen && (
            <Filters userSelectedDates={userSelectedDates} />
          )} */}

          {!isScreenSize && (
            <div className="w-[99%]">
              <Filters
                cars={carList} // Pass car list to Filters
                onFilter={handleFilter}
              />
            </div>
          )}
          <div className="w-[1%] relative left-1 hidden lg:flex">
            <div className="h-full w-[1px] bg-gray-400"></div>
          </div>
        </div>

        <div
          className={` flex ${isScreenSize ? "w-full" : "w-[73.5%]"} fixed `}
          style={{
            marginLeft: isScreenSize ? "0px" : "22.5%",
            marginTop: isScreenSize ? "12%" : "0%",
          }}
        >
          {filteredCars.length > 0 ? (
            <div
              className={`${
                isScreenSize ? "h-[73vh] " : "h-[630px] "
              } no-scrollbar overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
            >
              <div className="md:grid md:grid-cols-3 md:gap-4 w-full">
                {filteredCars.map((item, index) => (
                  <CarItem car={item} onBookNow={handleBookNow} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className=" w-full  flex justify-center items-center h-[579px]"
              style={{ paddingLeft: "6%" }}
            >
              {!isLoaderOpen  && (
                // <img
                //   src="https://ideogram.ai/assets/progressive-image/balanced/response/9s0QYH0tSRy_M0ThsX0BPw"
                //   className="full  opacity-80"
                // />
                <div className="w-full h-screen  flex justify-center items-center">
                          <h1 className="font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white flex items-center gap-2">
                            No Cars Found
                            <img src={sad} className="h-10 w-10" alt="No Bookings" />
                          </h1>
                        </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsDisplay;
