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

const CarsDisplay = ({ category }) => {
  const [carList, setCarList] = useState([]);
  const [searchParams] = useSearchParams();
  const pickUpDateString = searchParams.get("pickUpDate");
  const dropOffDate = searchParams.get("toDate");
  const userLocation = searchParams.get("location");
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
  console.log(userLocation, " loaction is ");
  console.log("Formatted Pick-Up Date:", formattedPickUpDate);
  console.log("Formatted Drop-Off Date:", formattedDropOffDate);
  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching car list:", error);
      }
    };
    fetchData();
  }, []);
  const { car_list } = useContext(StoreContext);
  return (
    <div
      className="cars-display flex w-full"
      id="cars-display"
      style={{ marginTop: "80px" }}
    >
      <div className="heading w-3/12 shadow-2xl flex">
        <div className="w-[99%]">
          {" "}
          <Filters />
        </div>
        <div className="w-[1%] relative left-1">
          <div className="h-screen w-[1px] bg-gray-500"></div>
        </div>
      </div>
      <div className=" flex w-9/12 ">
        {carList.map((item, index) => {
          return (
            <CarItem
              key={index}
              id={item._id}
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default CarsDisplay;
