import React, { useContext } from "react";
import "./CarsDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import CarItem from "../CarItem/CarItem";
import axios from "axios";
import constants from "../../config/constants";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "../Filters/Filters";
import Loader from "../Loader/Loader";
import { useScreenSize } from "../../context/screenSizeContext";
import Modal from "../Modal/Modal";
import BookingModel from "../CarItem/BookingModel";

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
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const isScreenSize = useScreenSize().isScreenSmall;
  const [selectedCar, setSelectedCar] = useState([]);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
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
        console.log(formattedPickUpDate, " formated pickup date ");
        const response = await axios.get(`${constants.API_BASE_URL}/user/car`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            location: userLocation ||"",
            start_date: formattedPickUpDate|| "2025/02/21",
            end_date: formattedDropOffDate ||"2025/02/23",
            end_time: dropOffTime||"11:00",
            start_time: pickupTime||"10:00",
          },
        });

        setCarList(response.data.data);
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
    setIsBookingOpen(!isBookingOpen);
    setSelectedCar(currentItems);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="w-full">
        {isBookingOpen && (
          <BookingModel
            carInfo={selectedCar}
            userSelectedDates={userSelectedDates}
            closeModal={() => setIsBookingOpen(false)}
          />
        )}
        {isLoaderOpen && (
          <div
            className="fixed inset- w-full flex items-center justify-center z-10"
            style={{ marginTop: "10%", marginLeft: "5%" }}
          >
            <div
              className="bg-white dark:bg-neutral-950 relative rounded-lg shadow-2xl w-full max-w-[240px] h-[150px] mx-4 md:mx-0 p-8 space-y-8"
              style={{ padding: "40px 40px" }}
            >
              <div className="inset-0 flex flex-col items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <div
                  className="text-lg font-semibold"
                  style={{ marginTop: "20px" }}
                >
                  <h1>Loading</h1>
                </div>
              </div>
            </div>
          </div>
        )}
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
        className={` flex ${isLogin ? "w-full" : "w-full"} `}
        style={{
          marginTop: "65px",
        }}
      >
        {!isScreenSize && (
          <div
            className="heading w-[22%] shadow-2xl flex h-screen fixed top-0 left-0"
            style={{
              marginLeft: isLogin ? "4.5%" : undefined,
              marginTop: "80px",
            }}
          >
            {!isScreenSize && (
              <div className="w-[99%]">
                <Filters userSelectedDates={userSelectedDates} />
              </div>
            )}
            <div className="w-[1%] relative left-1">
              <div className="h-full w-[1px] bg-gray-400"></div>
            </div>
          </div>
        )}

        <div
          className={` flex ${isScreenSize ? "w-full" : "w-[73.5%]"}fixed  `}
          style={{ marginLeft: isScreenSize ? "0px" : "22.5%" }}
        >
          {carList.length > 0 ? (
            <div
              className={`${
                isScreenSize ? "h-[530px] " : "h-[630px] "
              } no-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
            >
              <div className="md:grid md:grid-cols-3 md:gap-4">
                {carList.map((item, index) => (
                  <CarItem
                    key={index}
                    id={item.car_id}
                    brand={item.brand}
                    availability={item.availability}
                    daily_rent={item.daily_rent}
                    model_year={item.model_year}
                    registration_number={item.registration_number}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    userSelectedDates={userSelectedDates}
                    image={item.car_cover_img_url}
                    image_ext={item.image_ext}
                    location={item.location}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className=" w-full  flex justify-center items-center h-[579px]"
              style={{ paddingLeft: "6%" }}
            >
              {!isLoaderOpen && (
                <img
                  src="https://ideogram.ai/assets/progressive-image/balanced/response/9s0QYH0tSRy_M0ThsX0BPw"
                  className="full  opacity-80"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsDisplay;
