import React,{useEffect,useState} from "react";
import { assets } from "../../assets/assets";

const CarItem = ({
  id,
  name,
  price,
  description,
  image,
  brand,
  availability,
  daily_rent,
  model_year,
  registration_number,
  image_ext,
  location,
  onBookNow 
}) => {
  const isBase64 = typeof image === "string" && image.startsWith("data:image");
  const base64String = btoa(
    new Uint8Array(image.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  const imageString = `data:image/${image_ext};base64,${base64String}`;
  const [carsLeft, setCarsLeft] = useState(5);
  useEffect(() => {
    setCarsLeft(Math.floor(Math.random() * 6) + 1);
  }, []);

  const onBookNowClick  = (id) => {
    console.log(id, model_year, registration_number, daily_rent)
    onBookNow(id);
  }

  return (
    <div
      className="max-w-sm rounded-2xl md:grid-cols-3 p-3 items-center justify-center h-[350px] overflow-hidden shadow-xl border border-gray-200 hover:shadow-lg hover:scale-101 "
      style={{ padding: "10px", margin: "10px" }}
    >
      <div className="relative">
        <p className=" text-right font-semibold text-[#6f82c6]">{carsLeft}+ Cars Left</p>
        <p className="text-lg font-semibold text-center text-gray-800">
          {" "}
          {brand} {name}
        </p>
        <div className="flex items-center justify-center">
          <img
            src={imageString}
            alt="Car"
            className="w-[70%] h-48 object-fit rounded-xl "
          />
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div> */}
      </div>
      <div
        className="flex justify-start items-start"
        style={{ marginTop: "10px" }}
      >
        <div className="" style={{ paddingRight: "60px" }}>
          <div className="p-6">
            {/* <p className="text-sm text-gray-600 mb-4">{description}</p> */}
            <div className="flex flex-col items-start justify-start text-sm ">
              {/* <p className="text-gray-500">
            <span className="font-semibold text-gray-800">Available:</span> {availability}
          </p> */}
              <p className="text-gray-500">
                <span className="font-semibold text-gray-800 text-xl">₹</span>{" "}
                RS {daily_rent}
              </p>
              <p className="text-gray-500">(179 KM included)</p>
              <p className="text-gray-500">Excess ₹ 3.5/km</p>
              {/* <p className="text-gray-500">
            <span className="font-semibold text-gray-800">Year:</span> {model_year}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold text-gray-800">Reg No:</span> {registration_number}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold text-gray-800">Location:</span> {location}
          </p> */}
            </div>
            <div></div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-center items-center">
          <img
            src={assets.rating_starts}
            alt="Rating"
            className="w-20 h-4"
            style={{ marginBottom: "10px" }}
          />
          <button
            className="w-[140px] py-2 h-[40px] text-sm bg-[#6f82c6] font-medium border border-[#6f82c6] text-white rounded-lg shadow-md transition-all duration-300 ease-in-out 
  hover:bg-[#5a6bab] hover:border-[#5a6bab] hover:shadow-lg hover:scale-105 
  active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#6f82c6]"
           onClick={() => onBookNowClick (id)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarItem;
