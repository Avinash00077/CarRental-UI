import React, { useEffect, useState } from "react";
import hyderabad from "../../assets/hyderabad.png";
import delhi from "../../assets/delhi.png";
import chennai from "../../assets/chennai.png";
import bangalore from "../../assets/bangalore.png";
import gujarat from "../../assets/gujarat.png";
import { useScreenSize } from "../../context/screenSizeContext";
import kolkata from "../../assets/kolkata.png";
import constants from "../../config/constants";
import axios from "axios";

const LocationModal = ({ closeModal, onSelectLocation }) => {
  const isScreenSize = useScreenSize().isScreenSmall;
  const [locationsData, setLocationsData] = useState([]);
  const fetchLocations = async () => {
    try {
      console.log("i am called");
      const response = await axios.get(
        `${constants.API_BASE_URL}/user/locations`
      );

      let locationData = response.data.data.map((i) => {
        return {
          name: i.location,
          image: locationImages[i.location],
        };
      });

      setLocationsData(locationData);
    } catch (error) {
      console.error(error)
    }
  };
  useEffect(() => {
    fetchLocations();
  }, []);

  // const locationImages = [
  //   {
  //     name: "Hyderbad",
  //     image: hyderabad,
  //   },
  //   {
  //     name: "Delhi",
  //     image: delhi,
  //   },
  //   {
  //     name: "Chennai",
  //     image: chennai,
  //   },
  //   {
  //     name: "Bangalore",
  //     image: bangalore,
  //   },
  //   {
  //     name: "Gujarat",
  //     image: gujarat,
  //   },
  //   {
  //     name: "Kolkata",
  //     image: kolkata,
  //   },
  // ];

  const locationImages = {
    Hyderabad: hyderabad,
    Bangalore: bangalore,
    Chennai: chennai,
    Kolkata: kolkata,
    Vijayawada: gujarat,
    Narsapur: delhi,
  };



  const selectedLocation = (location) => {
    onSelectLocation(location);
    closeModal();
  };
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center  z-50">
        <div
          className={`relative rounded-lg shadow-2xl bg-gradient-to-b from-[#f5bfd7] to-[#abc9e9]  ${
            isScreenSize ? " flex w-[93%] h-[300px]" : "w-[40%] h-auto"
          }  mx-4 md:mx-0 p-8 space-y-8`}
          style={{ padding: "20px" }}
        >
          <div className="flex justify-end" onClick={closeModal}>
            <span className="material-icons cursor-pointer text-xl  hover:scale-105 transition-transform">
              X
            </span>
          </div>
          <div className="flex items-center justify-center">
            {locationsData.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4">
                {locationsData.map((location, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-4 cursor-pointer hover:scale-105 transition-transform"
                    style={{ padding: "10px" }}
                    onClick={() => selectedLocation(location.name)}
                  >
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-2o h-20 object-fit"
                    />
                    <h1 className="text-lg font-semibold mt-2 text-gray-800">
                      {location.name}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
