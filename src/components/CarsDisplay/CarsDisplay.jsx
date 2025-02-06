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
import BookingModel from "../CarItem/BookingModel";

const CarsDisplay = ({ category, }) => {
  const [carList, setCarList] = useState([]);
  const [searchParams] = useSearchParams();
  const pickUpDateString = searchParams.get("pickUpDate");
  const dropOffDate = searchParams.get("toDate");
  const userLocation = searchParams.get("location");
  const [isLoaderOpen,setIsLoderOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLogin(true);
    }
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const pickUpDate = pickUpDateString ? new Date(pickUpDateString) : null;
  const formattedDropOffDate = dropOffDate ? formatDate(dropOffDate) : null;
  const formattedPickUpDate =
    pickUpDate &&
    `${pickUpDate.getFullYear()}-${String(pickUpDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(pickUpDate.getDate()).padStart(2, "0")}`;
  useEffect(() => {
    setIsLoderOpen(true)
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(`${constants.API_BASE_URL}/car`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            location: userLocation,
            from_date: formattedPickUpDate,
            to_date: formattedDropOffDate,
          },
        });

        setCarList(response.data.data);
        setIsLoderOpen(false)
      } catch (error) {
        console.error("Error fetching car list:", error);
        setIsLoderOpen(false)
      }
    };
    fetchData();
  }, []);
  const handleBookNow = (id) => {
    const currentItems = carList.filter(x=>x.car_id==id)
    setIsBookingOpen(!isBookingOpen);
    setSelectedCar(currentItems);
  };
  return (
    <div>
      <div className="w-full"> {isBookingOpen && <BookingModel carInfo={selectedCar} closeModal={()=>setIsBookingOpen(false)} />}  {isLoaderOpen &&<Loader/>} </div>
      <div
        className={`cars-display flex ${
          isLogin ? "w-[85%]" : "w-full"
        } bg-green-800`}
        style={{
          marginTop: "80px",
        }}
      >
        <div
          className="heading w-[22%] shadow-2xl flex h-screen fixed top-0 left-0"
          style={{
            marginLeft: isLogin ? "13.5%" : undefined,
            marginTop: "80px",
          }}
        >
          <div className="w-[99%]">
            <Filters />
          </div>
          <div className="w-[1%] relative left-1">
            <div className="h-full w-[1px] bg-gray-400"></div>
          </div>
        </div>

        <div className=" flex w-9/12 fixed  " style={{ marginLeft: "25.5%" }}>
          {carList.map((item, index) => {
            return (
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
                image={item.image}
                image_ext={item.image_ext}
                location={item.location}
                onBookNow={handleBookNow}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CarsDisplay;
